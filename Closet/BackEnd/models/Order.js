const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    name: String,
    image: String,
    quantity: Number,
    price: Number,
    selectedSize: String,
  },
  { _id: false }
);

const totalsSchema = new mongoose.Schema(
  {
    subtotal: Number,
    tax: Number,
    shippingFee: Number,
    total: Number,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerName: String,
    customerEmail: String,
    paymentMethod: { type: String, default: 'Cash On Delivery' },
    status: {
      type: String,
      enum: ['placed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },
    items: [orderItemSchema],
    totals: totalsSchema,
  },
  { timestamps: true }
);

orderSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

orderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

module.exports = mongoose.model('Order', orderSchema);

