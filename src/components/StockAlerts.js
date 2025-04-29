import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState('');

  const fetchAlerts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/alerts/low-stock', { withCredentials: true });
      setAlerts(res.data);
    } catch (err) {
      setError('Error al obtener alertas de stock');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div>
      <h2>Alertas de Stock</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {alerts.length === 0 ? (
        <p>No hay alertas de stock.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Stock Actual</th>
              <th>Stock Mínimo</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map(alert => (
              <tr key={alert.codproducto}>
                <td>{alert.descripcion}</td>
                <td>{alert.existencia}</td>
                <td>{alert.stock_minimo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockAlerts;
