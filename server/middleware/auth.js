const pool = require('../db');

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'No autorizado. Por favor inicie sesión.' });
    }
}

// Middleware to check if user has permission for a given permission name
function hasPermission(permissionName) {
    return async (req, res, next) => {
        if (!req.session || !req.session.user) {
            return res.status(401).json({ message: 'No autorizado. Por favor inicie sesión.' });
        }
        try {
            const userId = req.session.user.id;

            // Log userId and permissionName for debugging
            console.log(`Checking permission '${permissionName}' for user ID ${userId}`);

            // If user is admin (idusuario=1), grant all permissions
            if (userId === 1) {
                console.log('Admin user detected, granting all permissions');
                return next();
            }

            const [rows] = await pool.query(
                `SELECT p.nombre FROM permisos p
                 JOIN detalle_permisos dp ON p.id = dp.id_permiso
                 WHERE dp.id_usuario = ? AND p.nombre = ?`,
                [userId, permissionName]
            );
            if (rows.length > 0) {
                console.log(`Permission '${permissionName}' granted for user ID ${userId}`);
                next();
            } else {
                console.log(`Permission '${permissionName}' denied for user ID ${userId}`);
                res.status(403).json({ message: 'Acceso denegado. No tiene permiso para este recurso.' });
            }
        } catch (error) {
            console.error('Error verificando permisos:', error);
            res.status(500).json({ message: 'Error del servidor al verificar permisos' });
        }
    };
}

module.exports = {
    isAuthenticated,
    hasPermission,
};
