import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserForm from './UserForm';
import './ListStyles.css';
import './FormStyles.css';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users', { withCredentials: true });
      setUsers(response.data);
    } catch (err) {
      setError('Error al cargar usuarios');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`, { withCredentials: true });
        fetchUsers();
      } catch (err) {
        setError('Error al eliminar usuario');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingUser(null);
    fetchUsers();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  return (
    <div className="table-container">
      <h2 className="list-header">Lista de Usuarios</h2>
      {error && <p className="error-message">{error}</p>}
      {!showForm && <button className="btn" onClick={() => setShowForm(true)}>Agregar Usuario</button>}
      {showForm && (
        <UserForm user={editingUser} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
      )}
      {!showForm && (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.idusuario}>
                <td>{u.idusuario}</td>
                <td>{u.nombre}</td>
                <td>{u.correo}</td>
                <td>{u.usuario}</td>
                <td>
                  <button className="btn" onClick={() => handleEdit(u)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(u.idusuario)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersList;
