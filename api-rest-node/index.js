//Activa el modo stricto del código - mejores practicas
'use strict'

//Importar libreria mongoose
var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3999;

//Conexión a la bd
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_node', { useNewUrlParser: true})
        .then(() => {
            console.log('[La conexión a la base de datos de mongo se ha realizado correctamente] ...');

            // Crear el servidor
            app.listen(port, () => {
                console.log('[El servidor http://localhost:3999 está funcionando] ...');
                
            });
        })
        .catch(error => console.log(error));