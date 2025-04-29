import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PermissionsList = () => {
  const [permissions, setPermissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userPermissions, setUserPermissions] = useState([]);
  const { fetchPermissions } = useContext(AuthContext);

  useEffect(() => {
    fetchPermissionsList();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchUserPermissions(selectedUserId);
    } else {
      setUserPermissions([]);
    }
  }, [selectedUserId]);

  const fetchPermissionsList = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/permissions', { withCredentials: true });
      setPermissions(res.data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users', { withCredentials: true });
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchUserPermissions = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/permissions/user/${userId}`, { withCredentials: true });
      setUserPermissions(res.data);
    } catch (error) {
      console.error('Error fetching user permissions:', error);
    }
  };

  const handleAssignPermission = async (permId) => {
    try {
      await axios.post('http://localhost:5000/api/permissions/assign', {
        id_usuario: selectedUserId,
        id_permiso: permId,
      }, { withCredentials: true });
      fetchUserPermissions(selectedUserId);
      fetchPermissions(); // Refresh permissions in AuthContext
    } catch (error) {
      console.error('Error assigning permission:', error);
    }
  };

  const handleRemovePermission = async (permId) => {
    try {
      await axios.post('http://localhost:5000/api/permissions/remove', {
        id_usuario: selectedUserId,
        id_permiso: permId,
      }, { withCredentials: true });
      fetchUserPermissions(selectedUserId);
      fetchPermissions(); // Refresh permissions in AuthContext
    } catch (error) {
      console.error('Error removing permission:', error);
    }
  };

  const isPermissionAssigned = (permId) => {
    return userPermissions.some((perm) => perm.id === permId);
  };

  return (
    <div>
      <h2>Gestión de Permisos</h2>
      <div>
        <label>Selecciona un usuario: </label>
        <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
          <option value="">-- Seleccionar --</option>
          {users.map((user) => (
            <option key={user.idusuario} value={user.idusuario}>
              {user.nombre}
            </option>
          ))}
        </select>
      </div>
      {selectedUserId && (
        <div>
          <h3>Permisos disponibles</h3>
          <ul>
            {permissions.map((perm) => (
              <li key={perm.id}>
                {perm.nombre}{' '}
                {isPermissionAssigned(perm.id) ? (
                  <button onClick={() => handleRemovePermission(perm.id)}>Quitar</button>
                ) : (
                  <button onClick={() => handleAssignPermission(perm.id)}>Asignar</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PermissionsList;
