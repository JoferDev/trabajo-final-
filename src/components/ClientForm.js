import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FormStyles.css';

const ClientForm = ({ client, onSuccess, onCancel }) => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (client) {
      setNombre(client.nombre);
      setTelefono(client.telefono);
      setDireccion(client.direccion);
    }
  }, [client]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!nombre || !telefono || !direccion) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }
    try {
      if (client) {
        // Update client
        await axios.put(`http://localhost:5000/api/clients/${client.idcliente}`, { nombre, telefono, direccion }, { withCredentials: true });
      } else {
        // Create client
        await axios.post('http://localhost:5000/api/clients', { nombre, telefono, direccion }, { withCredentials: true });
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar cliente');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}
      <div>
        <label>Nombre:</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div>
        <label>Teléfono:</label>
        <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
      </div>
      <div>
        <label>Dirección:</label>
        <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
      </div>
      <button type="submit">{client ? 'Actualizar' : 'Crear'}</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancelar</button>}
    </form>
  );
};

export default ClientForm;
