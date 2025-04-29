import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [permissions, setPermissions] = useState([]);

  const fetchPermissions = useCallback(async () => {
    if (user && user.id) {
      try {
        const res = await axios.get('http://localhost:5000/api/permissions/user/' + user.id, { withCredentials: true });
        console.log('Permisos obtenidos del backend:', res.data);
        const permNames = res.data.map(p => p.nombre);
        console.log('Nombres de permisos:', permNames);
        setPermissions(permNames);
      } catch (error) {
        console.error('Error fetching user permissions:', error);
        setPermissions([]);
      }
    } else {
      setPermissions([]);
    }
  }, [user]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setPermissions([]);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, permissions, login, logout, fetchPermissions }}>
      {children}
    </AuthContext.Provider>
  );
};
