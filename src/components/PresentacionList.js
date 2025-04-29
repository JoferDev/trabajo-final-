import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PresentacionForm from './PresentacionForm';
import './ListStyles.css';
import './FormStyles.css';

const PresentacionList = () => {
  const [presentaciones, setPresentaciones] = useState([]);
  const [error, setError] = useState('');
  const [editingPresentacion, setEditingPresentacion] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchPresentaciones = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/presentacion');
      setPresentaciones(response.data);
    } catch (err) {
      setError('Error al cargar presentaciones');
    }
  };

  useEffect(() => {
    fetchPresentaciones();
  }, []);

  const handleEdit = (presentacion) => {
    setEditingPresentacion(presentacion);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta presentación?')) {
      try {
        await axios.delete(`http://localhost:5000/api/presentacion/${id}`);
        fetchPresentaciones();
      } catch (err) {
        setError('Error al eliminar presentación');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPresentacion(null);
    fetchPresentaciones();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPresentacion(null);
  };

  return (
    <div className="table-container">
      <h2 className="list-header">Lista de Presentaciones</h2>
      {error && <p className="error-message">{error}</p>}
      {!showForm && <button className="btn" onClick={() => setShowForm(true)}>Agregar Presentación</button>}
      {showForm && (
        <PresentacionForm presentacion={editingPresentacion} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
      )}
      {!showForm && (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Nombre Corto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {presentaciones.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.nombre_corto}</td>
                <td>
                  <button className="btn" onClick={() => handleEdit(p)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PresentacionList;
