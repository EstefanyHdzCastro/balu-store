const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// @desc    Crear Payment Intent de Stripe
// @route   POST /api/payments/create-intent
// @access  Public
router.post('/create-intent', async (req, res) => {
  try {
    const { orderNumber, amount } = req.body;

    if (!orderNumber || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Número de orden y monto son requeridos'
      });
    }

    // Verificar que la orden existe
    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    // Verificar que el monto coincide
    const amountInCents = Math.round(order.total * 100);
    
    if (Math.round(amount * 100) !== amountInCents) {
      return res.status(400).json({
        success: false,
        message: 'El monto no coincide con la orden'
      });
    }

    // Crear Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'mxn',
      metadata: {
        orderNumber: order.orderNumber,
        orderId: order._id.toString(),
        customerEmail: order.customer.email
      },
      automatic_payment_methods: {
        enabled: true,
      },
      description: `Pago para orden ${order.orderNumber} - Baluu Store`
    });

    // Guardar Payment Intent ID en la orden
    order.paymentDetails.paymentIntentId = paymentIntent.id;
    await order.save();

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear intención de pago',
      error: error.message
    });
  }
});

// @desc    Confirmar pago exitoso
// @route   POST /api/payments/confirm
// @access  Public
router.post('/confirm', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment Intent ID es requerido'
      });
    }

    // Verificar el Payment Intent con Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'El pago no ha sido completado exitosamente'
      });
    }

    // Buscar la orden por Payment Intent ID
    const order = await Order.findOne({
      'paymentDetails.paymentIntentId': paymentIntentId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    // Actualizar estado de pago en la orden
    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    order.paymentDetails.transactionId = paymentIntent.id;
    
    // Si hay información de tarjeta, guardarla
    if (paymentIntent.charges?.data?.[0]?.payment_method_details?.card) {
      const card = paymentIntent.charges.data[0].payment_method_details.card;
      order.paymentDetails.last4 = card.last4;
      order.paymentDetails.brand = card.brand;
    }

    // Agregar al timeline
    order.timeline.push({
      status: 'confirmed',
      note: 'Pago confirmado exitosamente',
      date: new Date()
    });

    await order.save();

    res.json({
      success: true,
      message: 'Pago confirmado exitosamente',
      data: {
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
        status: order.status
      }
    });

  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error al confirmar pago',
      error: error.message
    });
  }
});

// @desc    Webhook de Stripe para eventos de pago
// @route   POST /api/payments/webhook
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Manejar el evento
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        // Buscar la orden
        const order = await Order.findOne({
          'paymentDetails.paymentIntentId': paymentIntent.id
        });

        if (order && order.paymentStatus !== 'paid') {
          order.paymentStatus = 'paid';
          order.status = 'confirmed';
          order.paymentDetails.transactionId = paymentIntent.id;

          order.timeline.push({
            status: 'confirmed',
            note: 'Pago confirmado via webhook',
            date: new Date()
          });

          await order.save();
          console.log('Order payment confirmed via webhook:', order.orderNumber);
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        
        const failedOrder = await Order.findOne({
          'paymentDetails.paymentIntentId': failedPayment.id
        });

        if (failedOrder) {
          failedOrder.paymentStatus = 'failed';
          
          failedOrder.timeline.push({
            status: 'payment_failed',
            note: 'Pago falló',
            date: new Date()
          });

          await failedOrder.save();
          console.log('Order payment failed via webhook:', failedOrder.orderNumber);
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// @desc    Procesar reembolso
// @route   POST /api/payments/refund
// @access  Private/Admin
router.post('/refund', protect, async (req, res) => {
  try {
    const { orderNumber, amount, reason } = req.body;

    // Buscar la orden
    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'La orden no tiene un pago para reembolsar'
      });
    }

    // Crear reembolso en Stripe
    const refund = await stripe.refunds.create({
      payment_intent: order.paymentDetails.paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Reembolso parcial o total
      reason: 'requested_by_customer',
      metadata: {
        orderNumber: order.orderNumber,
        adminReason: reason || 'Reembolso procesado por administrador'
      }
    });

    // Actualizar orden
    order.paymentStatus = 'refunded';
    order.status = 'cancelled';

    order.timeline.push({
      status: 'refunded',
      note: `Reembolso procesado: ${reason || 'Sin razón especificada'}`,
      date: new Date(),
      updatedBy: req.user.name
    });

    await order.save();

    res.json({
      success: true,
      message: 'Reembolso procesado exitosamente',
      data: {
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    });

  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({
      success: false,
      message: 'Error al procesar reembolso',
      error: error.message
    });
  }
});

// @desc    Obtener detalles de pago
// @route   GET /api/payments/details/:orderNumber
// @access  Public
router.get('/details/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    // Devolver solo información básica del pago
    const paymentDetails = {
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      total: order.total,
      last4: order.paymentDetails.last4,
      brand: order.paymentDetails.brand
    };

    res.json({
      success: true,
      data: paymentDetails
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener detalles de pago',
      error: error.message
    });
  }
});

module.exports = router;
