const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: ['muestra', 'personalizado', 'popular']
  },
  basePrice: {
    type: Number,
    required: [true, 'El precio base es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    }
  }],
  materials: [{
    name: String,
    additionalCost: {
      type: Number,
      default: 0
    }
  }],
  sizes: [{
    name: String,
    additionalCost: {
      type: Number,
      default: 0
    }
  }],
  customizationOptions: [{
    name: String,
    type: {
      type: String,
      enum: ['text', 'color', 'image', 'select', 'number'],
      default: 'text'
    },
    required: {
      type: Boolean,
      default: false
    },
    options: [String], // Para tipo 'select'
    additionalCost: {
      type: Number,
      default: 0
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isSample: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  seo: {
    metaTitle: String,
    metaDescription: String,
    slug: {
      type: String,
      unique: true
    }
  }
}, {
  timestamps: true
});

// Índices para búsqueda
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ featured: 1 });

module.exports = mongoose.model('Product', productSchema);
