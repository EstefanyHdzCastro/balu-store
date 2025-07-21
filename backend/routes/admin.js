const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// @desc    Dashboard - Estadísticas generales
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const thisYear = new Date(today.getFullYear(), 0, 1);

    // Estadísticas de órdenes
    const totalOrders = await Order.countDocuments();
    const ordersThisMonth = await Order.countDocuments({
      createdAt: { $gte: thisMonth }
    });
    const ordersLastMonth = await Order.countDocuments({
      createdAt: { $gte: lastMonth, $lt: thisMonth }
    });

    // Estadísticas de ventas
    const totalSales = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const salesThisMonth = await Order.aggregate([
      { 
        $match: { 
          paymentStatus: 'paid',
          createdAt: { $gte: thisMonth }
        }
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const salesLastMonth = await Order.aggregate([
      { 
        $match: { 
          paymentStatus: 'paid',
          createdAt: { $gte: lastMonth, $lt: thisMonth }
        }
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    // Estadísticas de productos
    const totalProducts = await Product.countDocuments({ isActive: true });
    const featuredProducts = await Product.countDocuments({ 
      isActive: true, 
      featured: true 
    });

    // Estadísticas de usuarios
    const totalUsers = await User.countDocuments({ isActive: true });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thisMonth },
      isActive: true
    });

    // Órdenes por estado
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Órdenes recientes
    const recentOrders = await Order.find()
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber customer.name total status createdAt');

    // Productos más vendidos
    const topProducts = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: '$items.itemTotal' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          totalSold: 1,
          revenue: 1
        }
      }
    ]);

    // Calcular porcentajes de crecimiento
    const orderGrowth = ordersLastMonth > 0 
      ? ((ordersThisMonth - ordersLastMonth) / ordersLastMonth * 100).toFixed(1)
      : 0;

    const salesGrowth = salesLastMonth[0]?.total > 0
      ? (((salesThisMonth[0]?.total || 0) - salesLastMonth[0].total) / salesLastMonth[0].total * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalOrders,
          ordersThisMonth,
          orderGrowth: parseFloat(orderGrowth),
          totalSales: totalSales[0]?.total || 0,
          salesThisMonth: salesThisMonth[0]?.total || 0,
          salesGrowth: parseFloat(salesGrowth),
          totalProducts,
          featuredProducts,
          totalUsers,
          newUsersThisMonth
        },
        ordersByStatus: ordersByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentOrders,
        topProducts
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas del dashboard',
      error: error.message
    });
  }
});

// @desc    Reporte de ventas
// @route   GET /api/admin/sales-report
// @access  Private/Admin
router.get('/sales-report', protect, admin, async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    let matchStage = { paymentStatus: 'paid' };

    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    // Configurar agrupación por periodo
    let groupFormat;
    switch (groupBy) {
      case 'hour':
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
          hour: { $hour: '$createdAt' }
        };
        break;
      case 'day':
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      case 'month':
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
        break;
      case 'year':
        groupFormat = {
          year: { $year: '$createdAt' }
        };
        break;
      default:
        groupFormat = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
    }

    const salesReport = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupFormat,
          totalSales: { $sum: '$total' },
          orderCount: { $sum: 1 },
          averageOrderValue: { $avg: '$total' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 } }
    ]);

    res.json({
      success: true,
      data: salesReport
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al generar reporte de ventas',
      error: error.message
    });
  }
});

// @desc    Gestión de usuarios
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const { search, role, isActive } = req.query;

    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      filter.role = role;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex)
      .select('-password');

    res.json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
});

// @desc    Actualizar rol de usuario
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
router.put('/users/:id/role', protect, admin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rol inválido'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Rol actualizado exitosamente',
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar rol',
      error: error.message
    });
  }
});

// @desc    Activar/Desactivar usuario
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
router.put('/users/:id/status', protect, admin, async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: `Usuario ${isActive ? 'activado' : 'desactivado'} exitosamente`,
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar estado del usuario',
      error: error.message
    });
  }
});

// @desc    Backup de base de datos
// @route   POST /api/admin/backup
// @access  Private/Admin
router.post('/backup', protect, admin, async (req, res) => {
  try {
    // Aquí implementarías la lógica de backup
    // Por ejemplo, usando mongodump o una solución de backup automatizada
    
    res.json({
      success: true,
      message: 'Backup iniciado exitosamente',
      timestamp: new Date()
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear backup',
      error: error.message
    });
  }
});

module.exports = router;
