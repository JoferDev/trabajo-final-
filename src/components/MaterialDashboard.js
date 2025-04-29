import React, { useContext } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import SecurityIcon from '@mui/icons-material/Security';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import WarningIcon from '@mui/icons-material/Warning';
import { AuthContext } from '../context/AuthContext';

const drawerWidth = 240;

const MaterialDashboard = ({ children }) => {
  const { permissions, logout } = useContext(AuthContext);

  const menuItems = [
    { key: 'Dashboard', text: 'Dashboard', icon: <DashboardIcon />, to: '/', permission: null },
    { key: 'Ventas', text: 'Ventas', icon: <ShoppingCartIcon />, to: '/sales-history', permission: 'ventas' },
    { key: 'Clientes', text: 'Clientes', icon: <PeopleIcon />, to: '/clients', permission: 'clientes' },
    { key: 'Productos', text: 'Productos', icon: <InventoryIcon />, to: '/products', permission: 'productos' },
    { key: 'Permisos', text: 'Permisos', icon: <SecurityIcon />, to: '/permissions', permission: 'usuarios' },
    { key: 'Laboratorios', text: 'Laboratorios', icon: <LocalPharmacyIcon />, to: '/laboratorios', permission: 'laboratorios' },
    { key: 'Alertas', text: 'Alertas', icon: <WarningIcon />, to: '/alerts', permission: 'alertas' },
    { key: 'Usuarios', text: 'Usuarios', icon: <PeopleIcon />, to: '/users', permission: 'usuarios' },
    { key: 'Configuración', text: 'Configuración', icon: <SecurityIcon />, to: '/configuracion', permission: 'configuración' },
    { key: 'Tipos', text: 'Tipos', icon: <InventoryIcon />, to: '/tipos', permission: 'tipos' },
    { key: 'Presentación', text: 'Presentación', icon: <InventoryIcon />, to: '/presentacion', permission: 'presentacion' },
    { key: 'Nueva Venta', text: 'Nueva Venta', icon: <ShoppingCartIcon />, to: '/sales/new', permission: 'ventas' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Nova Salud - Dashboard
          </Typography>
          <button
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
            aria-label="Cerrar sesión"
          >
            Cerrar Sesión
          </button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {menuItems.map(({ key, text, icon, to, permission }) => {
            if (permission && !permissions.includes(permission)) {
              return null;
            }
            return (
              <ListItem component={Link} to={to} key={key}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default MaterialDashboard;
