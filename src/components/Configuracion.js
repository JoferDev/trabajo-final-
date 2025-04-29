import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Configuracion = () => {
  const [config, setConfig] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchConfig = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/configuracion');
      setConfig(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener configuración:', error);
      setMessage('Error al obtener configuración');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleChange = (e) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.put('http://localhost:5000/api/configuracion', config);
      setMessage('Configuración actualizada correctamente');
    } catch (error) {
      console.error('Error al actualizar configuración:', error);
      setMessage('Error al actualizar configuración');
    }
  };

  if (loading) return <p>Cargando configuración...</p>;

  return (
    <div>
      <h2>Configuración de la Empresa</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input type="text" name="nombre" value={config.nombre} onChange={handleChange} required />
        </div>
        <div>
          <label>Teléfono:</label>
          <input type="text" name="telefono" value={config.telefono} onChange={handleChange} required />
        </div>
        <div>
          <label>Correo Electrónico:</label>
          <input type="email" name="email" value={config.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Dirección:</label>
          <textarea name="direccion" value={config.direccion} onChange={handleChange} required />
        </div>
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default Configuracion;
