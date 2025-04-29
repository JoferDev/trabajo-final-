const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all laboratories
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM laboratorios');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching laboratories:', error);
    res.status(500).json({ message: 'Error al obtener laboratorios' });
  }
});

// Get laboratory by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM laboratorios WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Laboratorio no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching laboratory:', error);
    res.status(500).json({ message: 'Error al obtener laboratorio' });
  }
});

// Create new laboratory
router.post('/', async (req, res) => {
  const { laboratorio, direccion } = req.body;
  if (!laboratorio || !direccion) {
    return res.status(400).json({ message: 'Nombre y dirección son requeridos' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO laboratorios (laboratorio, direccion) VALUES (?, ?)',
      [laboratorio, direccion]
    );
    res.status(201).json({ id: result.insertId, laboratorio, direccion });
  } catch (error) {
    console.error('Error creating laboratory:', error);
    res.status(500).json({ message: 'Error al crear laboratorio' });
  }
});

// Update laboratory
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { laboratorio, direccion } = req.body;
  if (!laboratorio || !direccion) {
    return res.status(400).json({ message: 'Nombre y dirección son requeridos' });
  }
  try {
    const [result] = await pool.query(
      'UPDATE laboratorios SET laboratorio = ?, direccion = ? WHERE id = ?',
      [laboratorio, direccion, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Laboratorio no encontrado' });
    }
    res.json({ id, laboratorio, direccion });
  } catch (error) {
    console.error('Error updating laboratory:', error);
    res.status(500).json({ message: 'Error al actualizar laboratorio' });
  }
});

// Delete laboratory
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM laboratorios WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Laboratorio no encontrado' });
    }
    res.json({ message: 'Laboratorio eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting laboratory:', error);
    res.status(500).json({ message: 'Error al eliminar laboratorio' });
  }
});

module.exports = router;
