const express = require('express');
const router = express.Router();
const pool = require('../db');
const md5 = require('md5');
const { isAuthenticated, hasPermission } = require('../middleware/auth');

// Get all users
router.get('/', isAuthenticated, hasPermission('usuarios'), async (req, res) => {
    try {
        console.log('GET /api/users called by user ID:', req.session.user.id);
        const [rows] = await pool.query('SELECT idusuario, nombre, correo, usuario FROM usuario');
        console.log('Users fetched:', rows.length);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
});

// Get user by id
router.get('/:id', isAuthenticated, hasPermission('usuarios'), async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT idusuario, nombre, correo, usuario FROM usuario WHERE idusuario = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener usuario' });
    }
});

// Create new user
router.post('/', isAuthenticated, hasPermission('usuarios'), async (req, res) => {
    const { nombre, correo, usuario, clave } = req.body;
    if (!nombre || !correo || !usuario || !clave) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    try {
        const hashedClave = md5(clave);
        const [result] = await pool.query('INSERT INTO usuario (nombre, correo, usuario, clave) VALUES (?, ?, ?, ?)', [nombre, correo, usuario, hashedClave]);
        res.status(201).json({ id: result.insertId, nombre, correo, usuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear usuario' });
    }
});

// Update user
router.put('/:id', isAuthenticated, hasPermission('usuarios'), async (req, res) => {
    const { id } = req.params;
    const { nombre, correo, usuario, clave } = req.body;
    if (!nombre || !correo || !usuario) {
        return res.status(400).json({ message: 'Nombre, correo y usuario son obligatorios' });
    }
    try {
        let query = 'UPDATE usuario SET nombre = ?, correo = ?, usuario = ?';
        const params = [nombre, correo, usuario];
        if (clave) {
            query += ', clave = ?';
            params.push(md5(clave));
        }
        query += ' WHERE idusuario = ?';
        params.push(id);
        const [result] = await pool.query(query, params);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
});

// Delete user
router.delete('/:id', isAuthenticated, hasPermission('usuarios'), async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM usuario WHERE idusuario = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
});

module.exports = router;
