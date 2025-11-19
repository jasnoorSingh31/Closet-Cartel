const express = require('express');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const Order = require('../models/Order');
const {
  authenticateToken,
  requireAdmin,
  JWT_SECRET,
} = require('../middleware/auth');

const router = express.Router();

const extractUserFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};

/**
 * POST /api/orders
 * Lightweight checkout endpoint:
 * 1. Validates the payload coming from the frontend.
 * 2. Deducts product stock for each line item.
 * 3. Returns a synthesized order summary (we're not persisting orders yet).
 */
router.post('/', async (req, res) => {
  try {
    const {
      items,
      totals = {},
      paymentMethod = 'Cash On Delivery',
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided',
      });
    }

    const normalizedItems = [];
    const decodedUser = extractUserFromHeader(req);

    for (const item of items) {
      const productId = item.productId || item.id;
      if (!productId || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Invalid item payload',
        });
      }

      // Pull the latest product data to double-check stock before reserving.
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found (${productId})`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      // Reserve inventory for this order.
      product.stock -= item.quantity;
      await product.save();

      normalizedItems.push({
        productId: product.id,
        name: product.name,
        image: product.image,
        quantity: item.quantity,
        price: Number(
          item.price ?? product.offerPrice ?? product.price ?? 0
        ),
        selectedSize: item.selectedSize || item.size || 'M',
      });
    }

    const computedTotal = normalizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const normalizedTotals = {
      subtotal:
        typeof totals.subtotal === 'number' ? totals.subtotal : computedTotal,
      tax: typeof totals.tax === 'number' ? totals.tax : 0,
      shippingFee:
        typeof totals.shippingFee === 'number' ? totals.shippingFee : 0,
      total:
        typeof totals.total === 'number'
          ? totals.total
          : computedTotal + (totals.tax || 0) + (totals.shippingFee || 0),
    };

    const orderNumber = `ORD-${Date.now()}`;

    const savedOrder = await Order.create({
      orderNumber,
      userId: decodedUser?.userId,
      customerName: decodedUser?.name,
      customerEmail: decodedUser?.email,
      paymentMethod,
      items: normalizedItems,
      totals: normalizedTotals,
    });

    res.json({
      success: true,
      order: savedOrder,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to place order',
    });
  }
});

router.get('/mine', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .sort('-createdAt')
      .lean();
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Fetch user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch orders',
    });
  }
});

router.get('/', authenticateToken, requireAdmin, async (_req, res) => {
  try {
    const orders = await Order.find().sort('-createdAt').lean();
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Fetch all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch orders',
    });
  }
});

module.exports = router;

