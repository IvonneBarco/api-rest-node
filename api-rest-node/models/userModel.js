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

//Configuración para no enviar algunos datos (No enviar password)
UserSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;

    return obj
}

//Exportar modulo
module.exports = mongoose.model('User', UserSchema);