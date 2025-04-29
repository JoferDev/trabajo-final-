import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TipoForm from './TipoForm';
import './ListStyles.css';
import './FormStyles.css';

const TiposList = () => {
  const [tipos, setTipos] = useState([]);
  const [error, setError] = useState('');
  const [editingTipo, setEditingTipo] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchTipos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tipos');
      setTipos(response.data);
    } catch (err) {
      setError('Error al cargar tipos');
    }
  };

  useEffect(() => {
    fetchTipos();
  }, []);

  const handleEdit = (tipo) => {
    setEditingTipo(tipo);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este tipo?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tipos/${id}`);
        fetchTipos();
      } catch (err) {
        setError('Error al eliminar tipo');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTipo(null);
    fetchTipos();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTipo(null);
  };

  return (
    <div className="table-container">
      <h2 className="list-header">Lista de Tipos</h2>
      {error && <p className="error-message">{error}</p>}
      {!showForm && <button className="btn" onClick={() => setShowForm(true)}>Agregar Tipo</button>}
      {showForm && (
        <TipoForm tipo={editingTipo} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
      )}
      {!showForm && (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tipos.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.tipo}</td>
                <td>
                  <button className="btn" onClick={() => handleEdit(t)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(t.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TiposList;
