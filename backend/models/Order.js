const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    name: {
      type: String,
      required: [true, 'El nombre del cliente es requerido']
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'El teléfono es requerido']
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'México'
      }
    }
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    basePrice: {
      type: Number,
      required: true
    },
    customizations: [{
      optionName: String,
      value: String,
      additionalCost: {
        type: Number,
        default: 0
      }
    }],
    selectedMaterial: {
      name: String,
      additionalCost: {
        type: Number,
        default: 0
      }
    },
    selectedSize: {
      name: String,
      additionalCost: {
        type: Number,
        default: 0
      }
    },
    itemTotal: {
      type: Number,
      required: true
    },
    specialInstructions: String
  }],
  subtotal: {
    type: Number,
    required: true
  },
  shipping: {
    cost: {
      type: Number,
      default: 0
    },
    method: {
      type: String,
      enum: ['standard', 'express', 'pickup'],
      default: 'standard'
    },
    trackingNumber: String
  },
  taxes: {
    type: Number,
    default: 0
  },
  discount: {
    amount: {
      type: Number,
      default: 0
    },
    code: String,
    reason: String
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_production', 'completed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'paypal', 'transfer', 'cash'],
    default: 'stripe'
  },
  paymentDetails: {
    transactionId: String,
    paymentIntentId: String,
    last4: String,
    brand: String
  },
  estimatedDelivery: Date,
  actualDelivery: Date,
  notes: String,
  internalNotes: String, // Solo para admin
  timeline: [{
    status: String,
    date: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: String
  }]
}, {
  timestamps: true
});

// Middleware para generar número de orden
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `BALUU-${(count + 1).toString().padStart(6, '0')}`;
  }
  next();
});

// Índices
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
