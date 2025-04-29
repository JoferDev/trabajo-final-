const express = require('express');
const router = express.Router();
const pool = require('../db');
const md5 = require('md5');

router.post('/login', async (req, res) => {
    const { usuario, clave } = req.body;
    console.log('Login attempt:', { usuario, clave });
    if (!usuario || !clave) {
        return res.status(400).json({ message: 'Usuario y clave son requeridos' });
    }
    try {
        const hashedClave = md5(clave);
        console.log('Hashed clave:', hashedClave);
        const [rows] = await pool.query('SELECT * FROM usuario WHERE usuario = ? AND clave = ?', [usuario, hashedClave]);
        console.log('Query result rows:', rows);
        if (rows.length > 0) {
            req.session.user = {
                id: rows[0].idusuario,
                nombre: rows[0].nombre,
                usuario: rows[0].usuario
            };
            return res.json({ message: 'Login exitoso', user: req.session.user });
        } else {
            return res.status(401).json({ message: 'Usuario o clave incorrectos' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error del servidor' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Sesión cerrada' });
});

module.exports = router;
