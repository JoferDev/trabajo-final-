const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get configuration (assuming only one row)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM configuracion WHERE id = 1');
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Configuración no encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener configuración' });
    }
});

// Update configuration
router.put('/', async (req, res) => {
    const { nombre, telefono, email, direccion } = req.body;
    if (!nombre || !telefono || !email || !direccion) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    try {
        const [result] = await pool.query(
            'UPDATE configuracion SET nombre = ?, telefono = ?, email = ?, direccion = ? WHERE id = 1',
            [nombre, telefono, email, direccion]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Configuración no encontrada' });
        }
        res.json({ message: 'Configuración actualizada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar configuración' });
    }
});

module.exports = router;
