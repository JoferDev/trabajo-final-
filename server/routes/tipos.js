const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all tipos
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tipos');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener tipos' });
    }
});

// Get tipo by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM tipos WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Tipo no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener tipo' });
    }
});

// Create new tipo
router.post('/', async (req, res) => {
    const { tipo } = req.body;
    if (!tipo) {
        return res.status(400).json({ message: 'El campo tipo es obligatorio' });
    }
    try {
        const [result] = await pool.query('INSERT INTO tipos (tipo) VALUES (?)', [tipo]);
        res.status(201).json({ id: result.insertId, tipo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear tipo' });
    }
});

// Update tipo
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { tipo } = req.body;
    if (!tipo) {
        return res.status(400).json({ message: 'El campo tipo es obligatorio' });
    }
    try {
        const [result] = await pool.query('UPDATE tipos SET tipo = ? WHERE id = ?', [tipo, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tipo no encontrado' });
        }
        res.json({ message: 'Tipo actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar tipo' });
    }
});

// Delete tipo
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM tipos WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tipo no encontrado' });
        }
        res.json({ message: 'Tipo eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar tipo' });
    }
});

module.exports = router;
