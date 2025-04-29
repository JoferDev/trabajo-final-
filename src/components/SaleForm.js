import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SaleForm = ({ sale, onSuccess = () => {}, onCancel = () => {} }) => {
  const [idCliente, setIdCliente] = useState('');
  const [idUsuario, setIdUsuario] = useState('');
  const [total, setTotal] = useState(0);
  const [detalle, setDetalle] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  // const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [createdSaleId, setCreatedSaleId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesRes, productosRes] = await Promise.all([
          axios.get('http://localhost:5000/api/clients', { withCredentials: true }),
          axios.get('http://localhost:5000/api/products', { withCredentials: true }),
        ]);
        setClientes(clientesRes.data);
        setProductos(productosRes.data);
      } catch (err) {
        console.error('Error fetching clients, products or users', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (sale) {
      setIdCliente(sale.id_cliente);
      setIdUsuario(sale.id_usuario);
      setTotal(sale.total);
      setDetalle(sale.detalle || []);
    }
  }, [sale]);

  const handleAddItem = () => {
    setDetalle([...detalle, { id_producto: '', cantidad: 1, descuento: 0, precio: 0, total: 0 }]);
  };

  const handleRemoveItem = (index) => {
    const newDetalle = [...detalle];
    newDetalle.splice(index, 1);
    setDetalle(newDetalle);
    calculateTotal(newDetalle);
  };

  const handleItemChange = (index, field, value) => {
    const newDetalle = [...detalle];
    newDetalle[index][field] = value;

    if (field === 'id_producto') {
      const producto = productos.find(p => p.codproducto === parseInt(value));
      if (producto) {
        newDetalle[index].precio = producto.precio;
        newDetalle[index].descripcion = producto.descripcion; // fix to use descripcion field
      } else {
        newDetalle[index].precio = 0;
        newDetalle[index].descripcion = ''; // clear descripcion if no product
      }
    }

    if (field === 'cantidad' || field === 'descuento' || field === 'precio') {
      const cantidad = parseFloat(newDetalle[index].cantidad) || 0;
      const descuento = parseFloat(newDetalle[index].descuento) || 0;
      const precio = parseFloat(newDetalle[index].precio) || 0;
      newDetalle[index].total = (cantidad * precio) - descuento;
    }

    setDetalle(newDetalle);
    calculateTotal(newDetalle);
  };

  const calculateTotal = (detalleItems) => {
    const totalCalc = detalleItems.reduce((acc, item) => acc + (parseFloat(item.total) || 0), 0);
    setTotal(totalCalc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Submitting sale with idCliente:', idCliente, 'detalle:', detalle);
    if (!idCliente || detalle.length === 0) {
      setError('Por favor complete todos los campos requeridos y agregue al menos un producto');
      return;
    }
    // Validate detalle items
    for (const item of detalle) {
      if (!item.id_producto || !item.cantidad || item.cantidad <= 0) {
        setError('Por favor seleccione productos válidos y cantidades mayores a cero');
        return;
      }
    }
    try {
      // Ensure id_usuario is always sent as a valid integer, fallback to a default user id if needed
      const userId = idUsuario ? parseInt(idUsuario) : 1; // Assuming 1 is a valid default user id
      const data = {
        id_cliente: parseInt(idCliente),
        id_usuario: userId,
        total,
        detalle: detalle.map(item => ({
          id_producto: parseInt(item.id_producto),
          cantidad: parseFloat(item.cantidad),
          descuento: parseFloat(item.descuento) || 0,
          precio: parseFloat(item.precio),
          total: parseFloat(item.total),
        })),
      };
      if (sale) {
        // Update sale not implemented yet
      } else {
        const response = await axios.post('http://localhost:5000/api/sales', data, { withCredentials: true });
        setSuccessMessage('Venta creada exitosamente');
        setError('');
        if (response.data && response.data.id) {
          const saleId = response.data.id;
          setCreatedSaleId(saleId);
        }
        // If onSuccess prop is provided, call it, else redirect after a short delay
        if (typeof onSuccess === 'function' && onSuccess !== (() => {})) {
          onSuccess();
        } else {
          // Removed redirect to allow user to generate boleta
          // setTimeout(() => {
          //   window.location.href = '/sales-history';
          // }, 1500);
        }
      }
    } catch (err) {
      console.error('Error al guardar venta:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(`Error: ${err.response.data.message}`);
      } else if (err.message) {
        setError(`Error: ${err.message}`);
      } else {
        setError('Error al guardar venta');
      }
      setSuccessMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <div>
        <label>Cliente:</label>
        <select value={idCliente} onChange={(e) => setIdCliente(e.target.value)} required>
          <option value="">Seleccione</option>
          {clientes.map(c => (
            <option key={c.idcliente} value={c.idcliente}>{c.nombre}</option>
          ))}
        </select>
      </div>
      {/* Remove Usuario field as per request */}
      {/* 
      <div>
        <label>Usuario:</label>
        <select value={idUsuario} onChange={(e) => setIdUsuario(e.target.value)} required>
          <option value="">Seleccione</option>
          {usuarios.map(u => (
            <option key={u.idusuario} value={u.idusuario}>{u.nombre}</option>
          ))}
        </select>
      </div>
      */}
      <div>
        <label>Detalle:</label>
        <button type="button" onClick={handleAddItem}>Agregar Producto</button>
        {detalle.map((item, index) => (
          <div key={index}>
            <label>Producto:</label>
            <select value={item.id_producto} onChange={(e) => handleItemChange(index, 'id_producto', e.target.value)} required>
              <option value="">Seleccione</option>
              {productos.map(p => (
                <option key={p.codproducto} value={p.codproducto}>{p.descripcion}</option>
              ))}
            </select>
            <label>Cantidad:</label>
            <input type="number" min="1" value={item.cantidad} onChange={(e) => handleItemChange(index, 'cantidad', e.target.value)} required />
            <label>Descuento:</label>
            <input type="number" min="0" step="0.01" value={item.descuento} onChange={(e) => handleItemChange(index, 'descuento', e.target.value)} />
            <label>Precio (S/):</label>
            <input type="number" min="0" step="0.01" value={item.precio} readOnly />
            <label>Total (S/):</label>
            <input type="number" min="0" step="0.01" value={item.total} readOnly />
            <button type="button" onClick={() => handleRemoveItem(index)}>Eliminar</button>
          </div>
        ))}
      </div>
      <div>
        <label>Total (S/):</label>
        <input type="number" value={total} readOnly />
      </div>
      <button type="submit">{sale ? 'Actualizar' : 'Crear'}</button>
      {createdSaleId && (
        <button type="button" onClick={() => window.open(`http://localhost:5000/api/sales/${createdSaleId}/pdf`, '_blank')}>
          Generar Boleta
        </button>
      )}
      {onCancel && <button type="button" onClick={onCancel}>Cancelar</button>}
    </form>
  );
};

export default SaleForm;
