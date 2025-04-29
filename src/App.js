import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import MaterialDashboard from './components/MaterialDashboard';
import PermissionsList from './components/PermissionsList';
import LaboratoriosList from './components/LaboratoriosList';
import StockAlerts from './components/StockAlerts';
import Reports from './components/Reports';
import SalesHistory from './components/SalesHistory';
import ClientsList from './components/ClientsList';
import ClientForm from './components/ClientForm';
import SalesList from './components/SalesList';
import SaleForm from './components/SaleForm';
import UsersList from './components/UsersList';
import UserForm from './components/UserForm';
import ProductsList from './components/ProductsList';
import ProductForm from './components/ProductForm';
import Configuracion from './components/Configuracion';
import TiposList from './components/TiposList';
import TipoForm from './components/TipoForm';
import PresentacionList from './components/PresentacionList';
import PresentacionForm from './components/PresentacionForm';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MaterialDashboard>
                <Reports />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/permissions"
          element={
            <ProtectedRoute requiredPermission="usuarios">
              <MaterialDashboard>
                <PermissionsList />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/laboratorios"
          element={
            <ProtectedRoute requiredPermission="laboratorios">
              <MaterialDashboard>
                <LaboratoriosList />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/alerts"
          element={
            <ProtectedRoute requiredPermission="alertas">
              <MaterialDashboard>
                <StockAlerts />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute requiredPermission="reportes">
              <MaterialDashboard>
                <Reports />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales-history"
          element={
            <ProtectedRoute requiredPermission="ventas">
              <MaterialDashboard>
                <SalesHistory />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients"
          element={
            <ProtectedRoute requiredPermission="clientes">
              <MaterialDashboard>
                <ClientsList />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/new"
          element={
            <ProtectedRoute requiredPermission="clientes">
              <MaterialDashboard>
                <ClientForm />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/:id/edit"
          element={
            <ProtectedRoute requiredPermission="clientes">
              <MaterialDashboard>
                <ClientForm />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute requiredPermission="ventas">
              <MaterialDashboard>
                <SalesList />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/new"
          element={
            <ProtectedRoute requiredPermission="ventas">
              <MaterialDashboard>
                <SaleForm />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales/:id/edit"
          element={
            <ProtectedRoute requiredPermission="ventas">
              <MaterialDashboard>
                <SaleForm />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuracion"
          element={
            <ProtectedRoute requiredPermission="configuración">
              <MaterialDashboard>
                <Configuracion />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tipos"
          element={
            <ProtectedRoute requiredPermission="tipos">
              <MaterialDashboard>
                <TiposList />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tipos/new"
          element={
            <ProtectedRoute requiredPermission="tipos">
              <MaterialDashboard>
                <TipoForm />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tipos/:id/edit"
          element={
            <ProtectedRoute requiredPermission="tipos">
              <MaterialDashboard>
                <TipoForm />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/presentacion"
          element={
            <ProtectedRoute requiredPermission="presentacion">
              <MaterialDashboard>
                <PresentacionList />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/presentacion/new"
          element={
            <ProtectedRoute requiredPermission="presentacion">
              <MaterialDashboard>
                <PresentacionForm />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/presentacion/:id/edit"
          element={
            <ProtectedRoute requiredPermission="presentacion">
              <MaterialDashboard>
                <PresentacionForm />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredPermission="usuarios">
              <MaterialDashboard>
                <UsersList />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/new"
          element={
            <ProtectedRoute requiredPermission="usuarios">
              <MaterialDashboard>
                <UserForm />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users/:id/edit"
          element={
            <ProtectedRoute requiredPermission="usuarios">
              <MaterialDashboard>
                <UserForm />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute requiredPermission="productos">
              <MaterialDashboard>
                <ProductsList />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/new"
          element={
            <ProtectedRoute requiredPermission="productos">
              <MaterialDashboard>
                <ProductForm />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id/edit"
          element={
            <ProtectedRoute requiredPermission="productos">
              <MaterialDashboard>
                <ProductForm />
              </MaterialDashboard>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
