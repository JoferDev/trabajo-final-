const express = require('express');
const router = express.Router();
const pool = require('../db');
const { isAuthenticated, hasPermission } = require('../middleware/auth');

// Get all permissions
router.get('/', isAuthenticated, hasPermission('usuarios'), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM permisos');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ message: 'Error al obtener permisos' });
  }
});

// Get permissions assigned to a user
// Removed hasPermission('usuarios') to allow any authenticated user to fetch their own permissions
router.get('/user/:userId', isAuthenticated, async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT p.* FROM permisos p
       JOIN detalle_permisos dp ON p.id = dp.id_permiso
       WHERE dp.id_usuario = ?`,
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    res.status(500).json({ message: 'Error al obtener permisos del usuario' });
  }
});

// Assign permission to user
router.post('/assign', isAuthenticated, hasPermission('usuarios'), async (req, res) => {
  const { id_usuario, id_permiso } = req.body;
  if (!id_usuario || !id_permiso) {
    return res.status(400).json({ message: 'id_usuario y id_permiso son requeridos' });
  }
  try {
    // Check if already assigned
    const [existing] = await pool.query(
      'SELECT * FROM detalle_permisos WHERE id_usuario = ? AND id_permiso = ?',
      [id_usuario, id_permiso]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Permiso ya asignado al usuario' });
    }
    await pool.query(
      'INSERT INTO detalle_permisos (id_usuario, id_permiso) VALUES (?, ?)',
      [id_usuario, id_permiso]
    );
    res.json({ message: 'Permiso asignado correctamente' });
  } catch (error) {
    console.error('Error assigning permission:', error);
    res.status(500).json({ message: 'Error al asignar permiso' });
  }
});

// Remove permission from user
router.post('/remove', isAuthenticated, hasPermission('usuarios'), async (req, res) => {
  const { id_usuario, id_permiso } = req.body;
  if (!id_usuario || !id_permiso) {
    return res.status(400).json({ message: 'id_usuario y id_permiso son requeridos' });
  }
  try {
    await pool.query(
      'DELETE FROM detalle_permisos WHERE id_usuario = ? AND id_permiso = ?',
      [id_usuario, id_permiso]
    );
    res.json({ message: 'Permiso removido correctamente' });
  } catch (error) {
    console.error('Error removing permission:', error);
    res.status(500).json({ message: 'Error al remover permiso' });
  }
});

module.exports = router;
