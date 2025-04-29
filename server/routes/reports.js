const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get total sales amount and count
router.get('/sales-summary', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS total_sales, SUM(total) AS total_amount FROM ventas'
    );
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching sales summary:', error);
    res.status(500).json({ message: 'Error al obtener resumen de ventas' });
  }
});

// Get inventory summary: total products, total stock, low stock count
router.get('/inventory-summary', async (req, res) => {
  try {
    const [totalProducts] = await pool.query('SELECT COUNT(*) AS count FROM producto');
    const [totalStock] = await pool.query('SELECT SUM(existencia) AS total FROM producto');
    const [lowStock] = await pool.query(
      'SELECT COUNT(*) AS count FROM producto WHERE existencia <= stock_minimo'
    );
    res.json({
      totalProducts: totalProducts[0].count,
      totalStock: totalStock[0].total,
      lowStock: lowStock[0].count,
    });
  } catch (error) {
    console.error('Error fetching inventory summary:', error);
    res.status(500).json({ message: 'Error al obtener resumen de inventario' });
  }
});

module.exports = router;
