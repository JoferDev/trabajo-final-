const express = require('express');
const router = express.Router();
const pool = require('../db');
const { isAuthenticated, hasPermission } = require('../middleware/auth');

// Get all sales with client and user info
router.get('/', isAuthenticated, hasPermission('ventas'), async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT v.id, v.total, v.fecha, c.nombre as cliente, u.nombre as usuario
             FROM ventas v
             INNER JOIN cliente c ON v.id_cliente = c.idcliente
             INNER JOIN usuario u ON v.id_usuario = u.idusuario`
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener ventas' });
    }
});

// Get sale by id with details
router.get('/:id', isAuthenticated, hasPermission('ventas'), async (req, res) => {
    const { id } = req.params;
    try {
        const [sales] = await pool.query(
            `SELECT v.id, v.total, v.fecha, c.nombre as cliente, u.nombre as usuario
             FROM ventas v
             INNER JOIN cliente c ON v.id_cliente = c.idcliente
             INNER JOIN usuario u ON v.id_usuario = u.idusuario
             WHERE v.id = ?`, [id]
        );
        if (sales.length === 0) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }
        const sale = sales[0];
        const [details] = await pool.query(
            `SELECT dv.id, dv.cantidad, dv.descuento, dv.precio, dv.total, p.descripcion
             FROM detalle_venta dv
             INNER JOIN producto p ON dv.id_producto = p.codproducto
             WHERE dv.id_venta = ?`, [id]
        );
        sale.detalle = details;
        res.json(sale);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener venta' });
    }
});

// Create new sale
router.post('/', isAuthenticated, hasPermission('ventas'), async (req, res) => {
    const { id_cliente, id_usuario, total, detalle } = req.body;
    if (!id_cliente || !id_usuario || !total || !Array.isArray(detalle) || detalle.length === 0) {
        return res.status(400).json({ message: 'Datos incompletos para crear venta' });
    }
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [result] = await connection.query(
            'INSERT INTO ventas (id_cliente, id_usuario, total, fecha) VALUES (?, ?, ?, NOW())',
            [id_cliente, id_usuario, total]
        );
        const idVenta = result.insertId;
        for (const item of detalle) {
            const { id_producto, cantidad, descuento, precio, total: totalItem } = item;
            await connection.query(
                `INSERT INTO detalle_venta (id_producto, id_venta, cantidad, descuento, precio, total)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [id_producto, idVenta, cantidad, descuento || 0, precio, totalItem]
            );
            // Update product stock
            await connection.query(
                `UPDATE producto SET existencia = existencia - ? WHERE codproducto = ?`,
                [cantidad, id_producto]
            );
        }
        await connection.commit();
        res.status(201).json({ message: 'Venta creada', id: idVenta });
    } catch (error) {
        await connection.rollback();
        console.error('Error al crear venta:', error);
        res.status(500).json({ message: 'Error al crear venta', error: error.stack });
    } finally {
        connection.release();
    }
});

const PDFDocument = require('pdfkit');
const { Readable } = require('stream');

router.get('/:id/pdf', async (req, res) => {
  const { id } = req.params;
  try {
    const [sales] = await pool.query(
      `SELECT v.id, v.total, v.fecha, v.id_cliente, c.nombre as cliente, u.nombre as usuario
       FROM ventas v
       INNER JOIN cliente c ON v.id_cliente = c.idcliente
       INNER JOIN usuario u ON v.id_usuario = u.idusuario
       WHERE v.id = ?`, [id]
    );
    if (sales.length === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    const sale = sales[0];

    // Fetch client details for phone, address
    const [clientDetails] = await pool.query(
      `SELECT nombre, telefono, direccion FROM cliente WHERE idcliente = ?`, [sale.id_cliente]
    );
    const client = clientDetails[0] || {};

    const [details] = await pool.query(
      `SELECT dv.cantidad, dv.descuento, dv.precio, dv.total, p.descripcion
       FROM detalle_venta dv
       INNER JOIN producto p ON dv.id_producto = p.codproducto
       WHERE dv.id_venta = ?`, [id]
    );

    // Fetch company info from configuracion table including 'email' column
    let company;
    try {
      const [configRows] = await pool.query('SELECT nombre, telefono, email, direccion FROM configuracion WHERE id = 1');
      company = configRows[0];
    } catch (err) {
      // fallback static company info if query fails
      company = {
        name: 'Nova Salud',
        phone: 'Tel: +51 123 456 789',
        email: 'contacto@novasalud.com',
        address: 'Av. Salud 123, Lima, Perú'
      };
    }

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('error', (err) => {
      console.error('PDF generation error:', err);
      res.status(500).json({ message: 'Error generando PDF', error: err.message || err.toString() });
    });
    doc.on('end', () => {
      let pdfData = Buffer.concat(buffers);
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=ventas.pdf`,
        'Content-Length': pdfData.length
      });
      res.end(pdfData);
    });

    // PDF content
    // Company header with fixed title "Nova Salud"
    doc.fontSize(22).text('Nova Salud', { align: 'center', underline: true });
    doc.moveDown(0.5);
    // Show company info from configuracion table
    doc.fontSize(10).text(company.telefono || company.phone, { align: 'center' });
    doc.text(company.email || company.correo || 'Correo no disponible', { align: 'center' });
    doc.text(company.direccion || company.address, { align: 'center' });
    doc.moveDown(1);

    // Draw a horizontal line under company info
    const pageWidth = doc.page.width;
    doc.moveTo(50, doc.y).lineTo(pageWidth - 50, doc.y).stroke();
    doc.moveDown(1);

    // Client info
    doc.fontSize(14).text('Datos del Cliente', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Nombre: ${client.nombre || sale.cliente || 'N/A'}`);
    doc.text(`Teléfono: ${client.telefono || 'N/A'}`);
    doc.text(`Dirección: ${client.direccion || 'N/A'}`);
    doc.moveDown(1);

    // Sale info
    const fechaTexto = sale.fecha ? new Date(sale.fecha).toLocaleString() : 'Fecha no disponible';
    doc.fontSize(12).text(`ID Venta: ${sale.id}`);
    doc.text(`Fecha: ${fechaTexto}`);
    doc.moveDown(1);

    // Table headers for products
    doc.fontSize(14).text('Detalle de Productos', { underline: true });
    doc.moveDown(0.5);

    // Table column titles
    const tableTop = doc.y;
    const itemX = 50;
    const qtyX = 250;
    const priceX = 300;
    const subtotalX = 370;
    const discountX = 440;
    const totalX = 510;

    doc.fontSize(10).text('Producto', itemX, tableTop, { bold: true });
    doc.text('Cantidad', qtyX, tableTop);
    doc.text('Precio', priceX, tableTop);
    doc.text('Subtotal', subtotalX, tableTop);
    doc.text('Descuento', discountX, tableTop);
    doc.text('Total', totalX, tableTop);
    doc.moveDown();

    // Draw a line under headers
    doc.moveTo(itemX, doc.y).lineTo(totalX + 50, doc.y).stroke();

    // List products
    let y = doc.y + 5;
    details.forEach(item => {
      const precio = Number(item.precio);
      const descuento = Number(item.descuento);
      const cantidad = Number(item.cantidad);
      const subtotal = cantidad * precio;
      const descuentoVal = isNaN(descuento) ? 0 : descuento;
      const totalVal = subtotal - descuentoVal;

      doc.fontSize(10).text(item.descripcion, itemX, y);
      doc.text(cantidad.toString(), qtyX, y);
      doc.text(`S/ ${precio.toFixed(2)}`, priceX, y);
      doc.text(`S/ ${subtotal.toFixed(2)}`, subtotalX, y);
      doc.text(`S/ ${descuentoVal.toFixed(2)}`, discountX, y);
      doc.text(`S/ ${totalVal.toFixed(2)}`, totalX, y);
      y += 20;
    });

    doc.moveDown(2);
    // Calculate total from product details
    const totalVenta = details.reduce((sum, item) => {
      const precio = Number(item.precio);
      const descuento = Number(item.descuento);
      const cantidad = Number(item.cantidad);
      const subtotal = cantidad * precio;
      const descuentoVal = isNaN(descuento) ? 0 : descuento;
      const totalVal = subtotal - descuentoVal;
      return sum + totalVal;
    }, 0);
    doc.fontSize(14).text(`Total a Pagar: S/ ${totalVenta.toFixed(2)}`, { align: 'right', bold: true });

    doc.end();

  } catch (error) {
    console.error('Error generando PDF:', error.stack || error);
    res.status(500).json({ message: 'Error generando PDF', error: error.message || error.toString() });
  }
});

module.exports = router;
