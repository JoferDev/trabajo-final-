import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserForm = ({ user, onSuccess, onCancel }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setNombre(user.nombre);
      setCorreo(user.correo);
      setUsuario(user.usuario);
      setClave('');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!nombre || !correo || !usuario || (!user && !clave)) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }
    try {
      if (user) {
        // Update user
        await axios.put(`http://localhost:5000/api/users/${user.idusuario}`, { nombre, correo, usuario, clave }, { withCredentials: true });
      } else {
        // Create user
        await axios.post('http://localhost:5000/api/users', { nombre, correo, usuario, clave }, { withCredentials: true });
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar usuario');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Nombre:</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </div>
      <div>
        <label>Correo:</label>
        <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
      </div>
      <div>
        <label>Usuario:</label>
        <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
      </div>
      <div>
        <label>Clave:</label>
        <input type="password" value={clave} onChange={(e) => setClave(e.target.value)} placeholder={user ? "Dejar vacío para no cambiar" : ""} />
      </div>
      <button type="submit">{user ? 'Actualizar' : 'Crear'}</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancelar</button>}
    </form>
  );
};

export default UserForm;
