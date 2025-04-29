import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { user, permissions } = useContext(AuthContext);

  if (!user) {
    // Not authenticated
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !permissions.includes(requiredPermission)) {
    // No permission
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Acceso denegado</h2>
        <p>No tienes permiso para acceder a este módulo.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
