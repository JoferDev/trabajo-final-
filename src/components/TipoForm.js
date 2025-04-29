import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TipoForm = ({ tipo, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({ tipo: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (tipo) {
      setFormData({ tipo: tipo.tipo });
    } else {
      setFormData({ tipo: '' });
    }
  }, [tipo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.tipo.trim()) {
      setError('El campo tipo es obligatorio');
      return;
    }
    try {
      if (tipo) {
        await axios.put(`http://localhost:5000/api/tipos/${tipo.id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/tipos', formData);
      }
      onSuccess();
    } catch (err) {
      setError('Error al guardar el tipo');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h3>{tipo ? 'Editar Tipo' : 'Nuevo Tipo'}</h3>
      {error && <p className="error-message">{error}</p>}
      <div>
        <label>Tipo:</label>
        <input type="text" name="tipo" value={formData.tipo} onChange={handleChange} required />
      </div>
      <button type="submit">{tipo ? 'Actualizar' : 'Crear'}</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

export default TipoForm;
