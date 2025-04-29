const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all presentaciones
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM presentacion');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener presentaciones' });
    }
});

// Get presentacion by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM presentacion WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Presentación no encontrada' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener presentación' });
    }
});

// Create new presentacion
router.post('/', async (req, res) => {
    const { nombre, nombre_corto } = req.body;
    if (!nombre || !nombre_corto) {
        return res.status(400).json({ message: 'Los campos nombre y nombre_corto son obligatorios' });
    }
    try {
        const [result] = await pool.query('INSERT INTO presentacion (nombre, nombre_corto) VALUES (?, ?)', [nombre, nombre_corto]);
        res.status(201).json({ id: result.insertId, nombre, nombre_corto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear presentación' });
    }
});

// Update presentacion
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, nombre_corto } = req.body;
    if (!nombre || !nombre_corto) {
        return res.status(400).json({ message: 'Los campos nombre y nombre_corto son obligatorios' });
    }
    try {
        const [result] = await pool.query('UPDATE presentacion SET nombre = ?, nombre_corto = ? WHERE id = ?', [nombre, nombre_corto, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Presentación no encontrada' });
        }
        res.json({ message: 'Presentación actualizada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar presentación' });
    }
});

// Delete presentacion
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM presentacion WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Presentación no encontrada' });
        }
        res.json({ message: 'Presentación eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar presentación' });
    }
});

module.exports = router;
