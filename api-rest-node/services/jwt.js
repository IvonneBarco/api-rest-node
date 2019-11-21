'user strict'

//Imports
var jwt = require('jwt-simple'); //crea el token
var moment = require('moment'); //valida el tiempo del token

exports.createToken = function (user) {
    
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    };

    return jwt.encode(payload, 'clave-secreta-para-generar-el-toke-123');
}