const express = require('express');
const Product = require('../models/Product');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Normalize incoming description data so we can accept either a string or array.
const normalizeDescription = (description) => {
  if (!description) return [];
  if (Array.isArray(description)) {
    return description.filter((item) => !!item && item.trim().length > 0);
  }
  return String(description)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

// Public - fetch active products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort('-createdAt');
    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch products',
    });
  }
});

// Admin - fetch all products
router.get('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort('-createdAt');
    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error('Fetch admin products error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch products',
    });
  }
});

// Public - fetch single active product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Fetch product error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch product',
    });
  }
});

// Admin - create
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      image,
      price,
      offerPrice,
      stock,
      size,
      rating,
      isActive,
    } = req.body;

    if (!name || !image || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, image URL, and price are required',
      });
    }

    if (
      offerPrice !== undefined &&
      offerPrice !== null &&
      Number(offerPrice) > Number(price)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Offer price cannot exceed original price',
      });
    }

    const product = await Product.create({
      name,
      category,
      description: normalizeDescription(description),
      image,
      price,
      offerPrice,
      stock,
      size,
      rating,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to create product',
    });
  }
});

// Admin - update
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.description) {
      updates.description = normalizeDescription(updates.description);
    }

    const hasOffer = updates.offerPrice !== undefined && updates.offerPrice !== null;
    const hasPrice = updates.price !== undefined && updates.price !== null;

    if (hasOffer && hasPrice && Number(updates.offerPrice) > Number(updates.price)) {
      return res.status(400).json({
        success: false,
        message: 'Offer price cannot exceed original price',
      });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to update product',
    });
  }
});

// Admin - delete
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to delete product',
    });
  }
});

module.exports = router;

