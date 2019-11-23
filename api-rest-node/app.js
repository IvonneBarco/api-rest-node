// 1. Control estricto
'use strict'

// 2. Requires
var express = require('express');
var bodyParser = require('body-parser');

// 3. Ejecutar express
var app = express();

// 7. Cargar archivos de rutas
var user_routes = require('./routes/userRoutes');
var topic_routes = require('./routes/topicRoutes');
var comment_routes = require('./routes/commentRoutes');

// 4. Middlewares : funcionalidades que se ejecutan antes de llegar a las acciones de los controllers
app.use(bodyParser.urlencoded({ extended: false })); //para que bodyParser funcione
app.use(bodyParser.json()); //Para convertir la petición a un obj Json

// 7. CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// 6. Reescribir rutas
app.use('/api', user_routes);
app.use('/api', topic_routes);
app.use('/api', comment_routes);

// 5. Exportar modulo
module.exports = app;