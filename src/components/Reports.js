import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reports = () => {
  const [salesSummary, setSalesSummary] = useState(null);
  const [inventorySummary, setInventorySummary] = useState(null);

  useEffect(() => {
    fetchSalesSummary();
    fetchInventorySummary();
  }, []);

  const fetchSalesSummary = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reports/sales-summary');
      setSalesSummary(res.data);
    } catch (error) {
      console.error('Error fetching sales summary:', error);
    }
  };

  const fetchInventorySummary = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reports/inventory-summary');
      setInventorySummary(res.data);
    } catch (error) {
      console.error('Error fetching inventory summary:', error);
    }
  };

  return (
    <div>
      <h2>Reportes y Estadísticas</h2>
      {salesSummary && (
        <div>
          <h3>Resumen de Ventas</h3>
          <p>Total de ventas: {salesSummary.total_sales}</p>
          <p>Monto total vendido: S/ {typeof salesSummary.total_amount === 'number' ? salesSummary.total_amount.toFixed(2) : parseFloat(salesSummary.total_amount).toFixed(2)}</p>
        </div>
      )}
      {inventorySummary && (
        <div>
          <h3>Resumen de Inventario</h3>
          <p>Total de productos: {inventorySummary.totalProducts}</p>
          <p>Stock total: {inventorySummary.totalStock}</p>
          <p>Productos con stock bajo: {inventorySummary.lowStock}</p>
        </div>
      )}
    </div>
  );
};

export default Reports;
