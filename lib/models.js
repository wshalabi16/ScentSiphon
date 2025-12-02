import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
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

export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);