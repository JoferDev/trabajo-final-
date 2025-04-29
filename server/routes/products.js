const express = require('express');
const router = express.Router();
const pool = require('../db');
const { isAuthenticated, hasPermission } = require('../middleware/auth');

// Get all products with joined info
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT p.codproducto, p.codigo, p.descripcion, p.precio, p.existencia, p.id_tipo, p.id_presentacion, p.id_lab, t.tipo, pr.nombre as presentacion, l.laboratorio, p.vencimiento
             FROM producto p
             INNER JOIN tipos t ON p.id_tipo = t.id
             INNER JOIN presentacion pr ON p.id_presentacion = pr.id
             INNER JOIN laboratorios l ON p.id_lab = l.id`
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
});

// Get product by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(
            `SELECT p.codproducto, p.codigo, p.descripcion, p.precio, p.existencia, p.id_tipo, p.id_presentacion, p.id_lab, t.tipo, pr.nombre as presentacion, l.laboratorio, p.vencimiento
             FROM producto p
             INNER JOIN tipos t ON p.id_tipo = t.id
             INNER JOIN presentacion pr ON p.id_presentacion = pr.id
             INNER JOIN laboratorios l ON p.id_lab = l.id
             WHERE p.codproducto = ?`, [id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener producto' });
    }
});

// Create new product
router.post('/', isAuthenticated, hasPermission('productos'), async (req, res) => {
    let { codigo, descripcion, precio, existencia, stock_minimo, id_tipo, id_presentacion, id_lab, vencimiento } = req.body;
    if (!codigo || !descripcion || !precio || !existencia || !id_tipo || !id_presentacion || !id_lab) {
        return res.status(400).json({ message: 'Todos los campos excepto vencimiento son obligatorios' });
    }
    // Set default stock_minimo to 10 if not provided or invalid
    if (stock_minimo === undefined || stock_minimo === null || isNaN(stock_minimo) || stock_minimo < 0) {
        stock_minimo = 10;
    }
    try {
        const [result] = await pool.query(
            `INSERT INTO producto (codigo, descripcion, precio, existencia, stock_minimo, id_tipo, id_presentacion, id_lab, vencimiento)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [codigo, descripcion, precio, existencia, stock_minimo, id_tipo, id_presentacion, id_lab, vencimiento || '0000-00-00']
        );
        res.status(201).json({ id: result.insertId, codigo, descripcion, precio, existencia, stock_minimo, id_tipo, id_presentacion, id_lab, vencimiento });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear producto' });
    }
});

 // Update product
router.put('/:id', isAuthenticated, hasPermission('productos'), async (req, res) => {
    const { id } = req.params;
    let { codigo, descripcion, precio, existencia, stock_minimo, id_tipo, id_presentacion, id_lab, vencimiento } = req.body;
    if (!codigo || !descripcion || !precio || !existencia || !id_tipo || !id_presentacion || !id_lab) {
        return res.status(400).json({ message: 'Todos los campos excepto vencimiento son obligatorios' });
    }
    // Set default stock_minimo to 10 if not provided or invalid
    if (stock_minimo === undefined || stock_minimo === null || isNaN(stock_minimo) || stock_minimo < 0) {
        stock_minimo = 10;
    }
    try {
        const [result] = await pool.query(
            `UPDATE producto SET codigo = ?, descripcion = ?, precio = ?, existencia = ?, stock_minimo = ?, id_tipo = ?, id_presentacion = ?, id_lab = ?, vencimiento = ?
             WHERE codproducto = ?`,
            [codigo, descripcion, precio, existencia, stock_minimo, id_tipo, id_presentacion, id_lab, vencimiento || '0000-00-00', id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar producto' });
    }
});

// Delete product
router.delete('/:id', isAuthenticated, hasPermission('productos'), async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM producto WHERE codproducto = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar producto' });
    }
});

module.exports = router;
