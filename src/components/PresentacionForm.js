import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PresentacionForm = ({ presentacion, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({ nombre: '', nombre_corto: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (presentacion) {
      setFormData({ nombre: presentacion.nombre, nombre_corto: presentacion.nombre_corto });
    } else {
      setFormData({ nombre: '', nombre_corto: '' });
    }
  }, [presentacion]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.nombre.trim() || !formData.nombre_corto.trim()) {
      setError('Los campos nombre y nombre corto son obligatorios');
      return;
    }
    try {
      if (presentacion) {
        await axios.put(`http://localhost:5000/api/presentacion/${presentacion.id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/presentacion', formData);
      }
      onSuccess();
    } catch (err) {
      setError('Error al guardar la presentación');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h3>{presentacion ? 'Editar Presentación' : 'Nueva Presentación'}</h3>
      {error && <p className="error-message">{error}</p>}
      <div>
        <label>Nombre:</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
      </div>
      <div>
        <label>Nombre Corto:</label>
        <input type="text" name="nombre_corto" value={formData.nombre_corto} onChange={handleChange} required />
      </div>
      <button type="submit">{presentacion ? 'Actualizar' : 'Crear'}</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default PresentacionForm;
