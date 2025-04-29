import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClientForm from './ClientForm';
import './ListStyles.css';

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');
  const [editingClient, setEditingClient] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clients', { withCredentials: true });
      setClients(response.data);
    } catch (err) {
      setError('Error al cargar clientes');
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleEdit = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      try {
        await axios.delete(`http://localhost:5000/api/clients/${id}`, { withCredentials: true });
        fetchClients();
      } catch (err) {
        setError('Error al eliminar cliente');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingClient(null);
    fetchClients();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingClient(null);
  };

  return (
    <div>
      <h2 className="list-header">Lista de Clientes</h2>
      {error && <p className="error-message">{error}</p>}
      {!showForm && <button className="btn" onClick={() => setShowForm(true)}>Agregar Cliente</button>}
      {showForm && (
        <ClientForm client={editingClient} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
      )}
      {!showForm && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.idcliente}>
                  <td>{c.idcliente}</td>
                  <td>{c.nombre}</td>
                  <td>{c.telefono}</td>
                  <td>{c.direccion}</td>
                  <td>
                    <button className="btn" onClick={() => handleEdit(c)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(c.idcliente)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientsList;
