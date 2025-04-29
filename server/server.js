const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const clientsRoutes = require('./routes/clients');
const productsRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');
const permissionsRoutes = require('./routes/permissions');
const laboratoriosRoutes = require('./routes/laboratorios');
const configuracionRoutes = require('./routes/configuracion');
const tiposRoutes = require('./routes/tipos');
const presentacionRoutes = require('./routes/presentacion');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

app.use(cors(corsOptions));

// Removed manual header setting middleware to avoid conflicts

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // For development only, set true with HTTPS
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/permissions', permissionsRoutes);
app.use('/api/configuracion', configuracionRoutes);
app.use('/api/tipos', tiposRoutes);
app.use('/api/presentacion', presentacionRoutes);
const alertsRoutes = require('./routes/alerts');
app.use('/api/laboratorios', laboratoriosRoutes);
const reportsRoutes = require('./routes/reports');
app.use('/api/alerts', alertsRoutes);
app.use('/api/reports', reportsRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
