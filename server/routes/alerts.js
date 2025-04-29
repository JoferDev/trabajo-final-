const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get products with stock below minimum
router.get('/low-stock', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT codproducto, descripcion, existencia, stock_minimo FROM producto WHERE existencia <= stock_minimo'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({ message: 'Error al obtener productos con stock bajo' });
  }
});

module.exports = router;
