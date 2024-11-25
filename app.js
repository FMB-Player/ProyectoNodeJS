const express = require('express');
const viewRoutes = require('./frontend/routes/viewRoutes');  // Importar las rutas de vistas
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middlewares, robado.
app.use(cors());
app.use(bodyParser.json());


// Pantalla de inicio
app.use('/', viewRoutes);

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});