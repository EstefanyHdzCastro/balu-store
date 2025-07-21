const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// @desc    Crear nueva orden personalizada
// @route   POST /api/orders
// @access  Public
router.post('/', [
  body('customer.name').notEmpty().withMessage('El nombre es requerido'),
  body('customer.email').isEmail().withMessage('Email válido es requerido'),
  body('customer.phone').notEmpty().withMessage('El teléfono es requerido'),
  body('items').isArray({ min: 1 }).withMessage('Debe incluir al menos un producto')
], async (req, res) => {
  try {
    // Validar errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: errors.array()
      });
    }

    const { customer, items, shipping } = req.body;

    // Validar y calcular precios de productos
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Producto ${item.product} no está disponible`
        });
      }

      // Calcular precio del item
      let itemPrice = product.basePrice * item.quantity;

      // Agregar costos de personalización
      let customizationCost = 0;
      if (item.customizations) {
        item.customizations.forEach(custom => {
          customizationCost += custom.additionalCost || 0;
        });
      }

      // Agregar costos de material y tamaño
      const materialCost = item.selectedMaterial?.additionalCost || 0;
      const sizeCost = item.selectedSize?.additionalCost || 0;

      const itemTotal = (itemPrice + customizationCost + materialCost + sizeCost) * item.quantity;

      validatedItems.push({
        ...item,
        basePrice: product.basePrice,
        itemTotal
      });

      subtotal += itemTotal;
    }

    // Calcular costos adicionales
    const shippingCost = shipping?.cost || 0;
    const taxes = subtotal * 0.16; // 16% IVA México
    const total = subtotal + shippingCost + taxes;

    // Crear la orden
    const orderData = {
      customer,
      items: validatedItems,
      subtotal,
      shipping: {
        cost: shippingCost,
        method: shipping?.method || 'standard'
      },
      taxes,
      total,
      timeline: [{
        status: 'pending',
        note: 'Orden creada exitosamente',
        date: new Date()
      }]
    };

    const order = await Order.create(orderData);

    // Poblar la información del producto
    await order.populate('items.product', 'name images');

    res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente',
      data: order
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la orden',
      error: error.message
    });
  }
});

// @desc    Obtener orden por número
// @route   GET /api/orders/:orderNumber
// @access  Public
router.get('/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate('items.product', 'name images description');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la orden',
      error: error.message
    });
  }
});

// @desc    Obtener todas las órdenes (Admin)
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const { status, paymentStatus, search } = req.query;

    // Construir filtros
    let filter = {};

    if (status) {
      filter.status = status;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    res.json({
      success: true,
      count: orders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener órdenes',
      error: error.message
    });
  }
});

// @desc    Actualizar estado de orden
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    // Actualizar estado
    order.status = status;

    // Agregar al timeline
    order.timeline.push({
      status,
      note: note || `Estado cambiado a ${status}`,
      date: new Date(),
      updatedBy: req.user.name
    });

    // Si se marca como entregado, establecer fecha de entrega
    if (status === 'delivered') {
      order.actualDelivery = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: 'Estado de orden actualizado',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar estado',
      error: error.message
    });
  }
});

// @desc    Actualizar información de envío
// @route   PUT /api/orders/:id/shipping
// @access  Private/Admin
router.put('/:id/shipping', protect, admin, async (req, res) => {
  try {
    const { trackingNumber, estimatedDelivery } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    // Actualizar información de envío
    if (trackingNumber) {
      order.shipping.trackingNumber = trackingNumber;
    }

    if (estimatedDelivery) {
      order.estimatedDelivery = new Date(estimatedDelivery);
    }

    // Cambiar estado a shipped si se proporciona tracking
    if (trackingNumber && order.status !== 'shipped') {
      order.status = 'shipped';
      order.timeline.push({
        status: 'shipped',
        note: `Orden enviada con número de seguimiento: ${trackingNumber}`,
        date: new Date(),
        updatedBy: req.user.name
      });
    }

    await order.save();

    res.json({
      success: true,
      message: 'Información de envío actualizada',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar envío',
      error: error.message
    });
  }
});

// @desc    Cancelar orden
// @route   PUT /api/orders/:id/cancel
// @access  Private/Admin
router.put('/:id/cancel', protect, admin, async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    if (order.status === 'delivered' || order.status === 'shipped') {
      return res.status(400).json({
        success: false,
        message: 'No se puede cancelar una orden enviada o entregada'
      });
    }

    order.status = 'cancelled';
    order.timeline.push({
      status: 'cancelled',
      note: reason || 'Orden cancelada por administrador',
      date: new Date(),
      updatedBy: req.user.name
    });

    await order.save();

    res.json({
      success: true,
      message: 'Orden cancelada exitosamente',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cancelar orden',
      error: error.message
    });
  }
});

module.exports = router;
