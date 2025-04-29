-- Script to assign all permissions to the admin user (idusuario = 1)

INSERT INTO detalle_permisos (id_usuario, id_permiso)
SELECT 1, p.id
FROM permisos p
WHERE NOT EXISTS (
    SELECT 1 FROM detalle_permisos dp WHERE dp.id_usuario = 1 AND dp.id_permiso = p.id
);
