import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SaleForm from './SaleForm';
import './ListStyles.css';

const SalesList = () => {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState('');
  const [editingSale, setEditingSale] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchSales = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales', { withCredentials: true });
      setSales(response.data);
    } catch (err) {
      setError('Error al cargar ventas');
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleEdit = (sale) => {
    setEditingSale(sale);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta venta?')) {
      try {
        await axios.delete(`http://localhost:5000/api/sales/${id}`, { withCredentials: true });
        fetchSales();
      } catch (err) {
        setError('Error al eliminar venta');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingSale(null);
    fetchSales();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingSale(null);
  };

  return (
    <div className="table-container">
      <h2 className="list-header">Lista de Ventas</h2>
      {error && <p className="error-message">{error}</p>}
      {!showForm && <button className="btn" onClick={() => setShowForm(true)}>Agregar Venta</button>}
      {showForm && (
        <SaleForm sale={editingSale} onSuccess={handleFormSuccess} onCancel={handleFormCancel} />
      )}
      {!showForm && (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.cliente}</td>
                <td>{s.total}</td>
                <td>{s.usuario}</td>
                <td>{new Date(s.fecha).toLocaleString()}</td>
                <td>
                  <button className="btn" onClick={() => handleEdit(s)}>Editar</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(s.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SalesList;
