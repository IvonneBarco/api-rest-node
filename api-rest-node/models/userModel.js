'use strict'

//Importar Mongoose
var mongoose = require('mongoose');

//Define las propuedades que tendrá el objeto
var Schema = mongoose.Schema;

//Esquema
var UserSchema = Schema({
    name: String,
    surname: String,
    email: String,
    password: String,
    image: String,
    role: String
});

//Exportar modulo
module.exports = mongoose.model('User', UserSchema);