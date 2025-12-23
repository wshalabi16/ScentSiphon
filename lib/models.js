import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
}, {
  timestamps: true,
});

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: String,
  price: { type: Number, required: true },
  images: [String],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', index: true },
  variants: [{
    size: { type: String, required: true },
    price: { type: Number, required: true },
    sku: String,
    stock: { type: Number, default: 0, min: 0 },  // ✅ Added min: 0
  }],
  featured: { type: Boolean, default: false, index: true },
}, {
  timestamps: true,
});

// Compound indexes for common queries
ProductSchema.index({ category: 1, createdAt: -1 });
ProductSchema.index({ featured: 1, createdAt: -1 });

const OrderSchema = new mongoose.Schema({
  line_items: Object,
  name: String,
  email: { type: String, index: true },
  city: String,
  province: String,
  postalCode: String,
  streetAddress: String,
  country: String,
  phone: String,
  paid: { type: Boolean, default: false, index: true },
  currency: { type: String, default: 'CAD' },
}, {
  timestamps: true,
});

// Compound index for common order lookups
OrderSchema.index({ email: 1, createdAt: -1 });

export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);