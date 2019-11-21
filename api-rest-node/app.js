// 1. Control estricto
'use strict'

// 2. Requires
var express = require('express');
var bodyParser = require('body-parser');

// 3. Ejecutar express
var app = express();

// 7. Cargar archivos de rutas
var user_routes = require('./routes/userRoutes');

// 4. Middlewares : funcionalidades que se ejecutan antes de llegar a las acciones de los controllers
app.use(bodyParser.urlencoded({ extended: false })); //para que bodyParser funcione
app.use(bodyParser.json()); //Para convertir la petición a un obj Json

// . CORS

// 6. Reescribir rutas
app.use('/api', user_routes);


// 5. Exportar modulo
module.exports = app;