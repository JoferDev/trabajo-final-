import React from 'react';
import axios from 'axios';
import UsersList from './UsersList';
import ClientsList from './ClientsList';
import ProductsList from './ProductsList';
import SalesList from './SalesList';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <nav className="bg-primary text-white p-3" style={{ width: '220px' }}>
        <h3 className="text-center mb-4">Farmacia</h3>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/" className="nav-link text-white">Dashboard</Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/permissions" className="nav-link text-white">Permisos</Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/laboratorios" className="nav-link text-white">Laboratorios</Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/alerts" className="nav-link text-white">Alertas de Stock</Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/sales-history" className="nav-link text-white">Historial de Ventas</Link>
          </li>
        </ul>
      </nav>

      {/* Main content */}
      <div className="flex-grow-1 p-4 overflow-auto bg-light">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Bienvenido, {user?.nombre}</h1>
          <button className="btn btn-danger" onClick={handleLogout}>Cerrar Sesión</button>
        </div>

        {/* CRUD sections */}
        <div className="row">
          <div className="col-md-6 mb-4">
            <UsersList />
          </div>
          <div className="col-md-6 mb-4">
            <ClientsList />
          </div>
          <div className="col-md-6 mb-4">
            <ProductsList />
          </div>
          <div className="col-md-6 mb-4">
            <SalesList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
