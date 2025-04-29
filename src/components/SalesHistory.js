import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [searchClient, setSearchClient] = useState('');
  const [filteredSales, setFilteredSales] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  useEffect(() => {
    if (searchClient.trim() === '') {
      setFilteredSales(sales);
    } else {
      const filtered = sales.filter(sale =>
        sale.cliente.toLowerCase().includes(searchClient.toLowerCase())
      );
      setFilteredSales(filtered);
    }
  }, [searchClient, sales]);

  const fetchSales = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/sales', { withCredentials: true });
      setSales(res.data);
      setFilteredSales(res.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  return (
    <div>
      <h2>Historial de Ventas</h2>
      <input
        type="text"
        placeholder="Buscar por cliente"
        value={searchClient}
        onChange={(e) => setSearchClient(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map(sale => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>{sale.cliente}</td>
              <td>S/ {typeof sale.total === 'number' ? sale.total.toFixed(2) : parseFloat(sale.total).toFixed(2)}</td>
              <td>{new Date(sale.fecha).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesHistory;
