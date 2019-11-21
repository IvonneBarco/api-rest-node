'user strict'

//Imports
var jwt = require('jwt-simple'); //crea el token
var moment = require('moment'); //valida el tiempo del token
var secret = 'clave-secreta-para-generar-el-toke-123';

exports.authenticated = function (request, response, next) {

    console.log("[MIDDLEWARE AUTHENTICADE]...");

    // 1. Comprobar si llega autorización
    if (!request.headers.authorization) {
        return response.status(403).send({
            message: 'La petición no tiene la cabecera de authorization'
        });
    }

    // 2. Limpiar el token y quitar comillas
    var token = request.headers.authorization.replace(/['"]+/g, '');

    try {
        // 3. Decodificar token
        var payload = jwt.decode(token, secret);

        // 4. Comprobar si el token esta vigente o a expirado
        if (payload.exp <= moment().unix()) {
            return response.status(404).send({
                message: 'El token ha expirado'
            });
        }

    } catch (exception) {
        return response.status(404).send({
            message: 'El token no es valido'
        });
    }

    // 5. Adjuntar usuario identificado a request
    request.user = payload;

    // 6. Pasar a la acción del controller
    next();
};