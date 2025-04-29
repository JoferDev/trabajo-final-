import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductForm = ({ product, onSuccess, onCancel }) => {
  const [codigo, setCodigo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [existencia, setExistencia] = useState('');
  const [stockMinimo, setStockMinimo] = useState(10);
  const [idTipo, setIdTipo] = useState('');
  const [idPresentacion, setIdPresentacion] = useState('');
  const [idLab, setIdLab] = useState('');
  const [vencimiento, setVencimiento] = useState('');
  const [tipos, setTipos] = useState([]);
  const [presentaciones, setPresentaciones] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch tipos, presentaciones, laboratorios for select options
    const fetchData = async () => {
      try {
        const [tiposRes, presentacionesRes, laboratoriosRes] = await Promise.all([
          axios.get('http://localhost:5000/api/tipos', { withCredentials: true }),
          axios.get('http://localhost:5000/api/presentacion', { withCredentials: true }),
          axios.get('http://localhost:5000/api/laboratorios', { withCredentials: true }),
        ]);
        setTipos(tiposRes.data);
        setPresentaciones(presentacionesRes.data);
        setLaboratorios(laboratoriosRes.data);
      } catch (err) {
        console.error('Error fetching select options', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (product) {
      setCodigo(product.codigo);
      setDescripcion(product.descripcion);
      setPrecio(product.precio);
      setExistencia(product.existencia);
      setStockMinimo(product.stock_minimo !== undefined ? product.stock_minimo : 10);
      setIdTipo(product.id_tipo || '');
      setIdPresentacion(product.id_presentacion || '');
      setIdLab(product.id_lab || '');
      setVencimiento(product.vencimiento || '');
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!codigo || !descripcion || !precio || !existencia || !idTipo || !idPresentacion || !idLab) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }
    try {
      const data = {
        codigo,
        descripcion,
        precio,
        existencia,
        stock_minimo: stockMinimo,
        id_tipo: idTipo,
        id_presentacion: idPresentacion,
        id_lab: idLab,
        vencimiento,
      };
      if (product) {
        await axios.put(`http://localhost:5000/api/products/${product.codproducto}`, data, { withCredentials: true });
      } else {
        await axios.post('http://localhost:5000/api/products', data, { withCredentials: true });
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar producto');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Código:</label>
        <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
      </div>
      <div>
        <label>Nombre:</label>
        <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
      </div>
      <div>
        <label>Precio:</label>
        <input type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} required />
      </div>
      <div>
        <label>Existencia:</label>
        <input type="number" value={existencia} onChange={(e) => setExistencia(e.target.value)} required />
      </div>
      <div>
        <label>Stock Mínimo:</label>
        <input type="number" value={stockMinimo} onChange={(e) => setStockMinimo(e.target.value)} required min="0" />
      </div>
      <div>
        <label>Tipo:</label>
        <select value={idTipo} onChange={(e) => setIdTipo(e.target.value)} required>
          <option value="">Seleccione</option>
          {tipos.map((t) => (
            <option key={t.id} value={t.id}>{t.tipo}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Presentación:</label>
        <select value={idPresentacion} onChange={(e) => setIdPresentacion(e.target.value)} required>
          <option value="">Seleccione</option>
          {presentaciones.map((p) => (
            <option key={p.id} value={p.id}>{p.nombre}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Laboratorio:</label>
        <select value={idLab} onChange={(e) => setIdLab(e.target.value)} required>
          <option value="">Seleccione</option>
          {laboratorios.map((l) => (
            <option key={l.id} value={l.id}>{l.laboratorio}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Vencimiento:</label>
        <input type="date" value={vencimiento} onChange={(e) => setVencimiento(e.target.value)} />
      </div>
      <button type="submit">{product ? 'Actualizar' : 'Crear'}</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancelar</button>}
    </form>
  );
};

export default ProductForm;
