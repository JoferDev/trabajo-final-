const express = require('express');
const router = express.Router();
const pool = require('../db');
const { isAuthenticated, hasPermission } = require('../middleware/auth');

// Get all clients
router.get('/', isAuthenticated, hasPermission('clientes'), async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cliente');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener clientes' });
    }
});

// Get client by id
router.get('/:id', isAuthenticated, hasPermission('clientes'), async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM cliente WHERE idcliente = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener cliente' });
    }
});

// Create new client
router.post('/', isAuthenticated, hasPermission('clientes'), async (req, res) => {
    const { nombre, telefono, direccion } = req.body;
    if (!nombre || !telefono || !direccion) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    try {
        const [result] = await pool.query('INSERT INTO cliente (nombre, telefono, direccion) VALUES (?, ?, ?)', [nombre, telefono, direccion]);
        res.status(201).json({ id: result.insertId, nombre, telefono, direccion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear cliente' });
    }
});

// Update client
router.put('/:id', isAuthenticated, hasPermission('clientes'), async (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, direccion } = req.body;
    if (!nombre || !telefono || !direccion) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    try {
        const [result] = await pool.query('UPDATE cliente SET nombre = ?, telefono = ?, direccion = ? WHERE idcliente = ?', [nombre, telefono, direccion, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json({ message: 'Cliente actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar cliente' });
    }
});

// Delete client
router.delete('/:id', isAuthenticated, hasPermission('clientes'), async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM cliente WHERE idcliente = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.json({ message: 'Cliente eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar cliente' });
    }
});

router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ message: 'Parámetro de búsqueda requerido' });
  }
  try {
    const [rows] = await pool.query(
      'SELECT * FROM cliente WHERE nombre LIKE ? OR telefono LIKE ?',
      [`%${q}%`, `%${q}%`]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error en búsqueda de clientes:', error);
    res.status(500).json({ message: 'Error en búsqueda de clientes' });
  }
});

module.exports = router;
