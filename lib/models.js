import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
}, {
  timestamps: true,
});

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [String],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  variants: [{
    size: { type: String, required: true },
    price: { type: Number, required: true },
    sku: String,
    stock: { type: Number, default: 0 },
  }],
  featured: { type: Boolean, default: false }, 
}, {
  timestamps: true,
});

const OrderSchema = new mongoose.Schema({
  line_items: Object,
  name: String,
  email: String,
  city: String,
  postalCode: String,
  streetAddress: String,
  country: String,
  paid: { type: Boolean, default: false },
  currency: { type: String, default: 'CAD' },
}, {
  timestamps: true,
});

export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);