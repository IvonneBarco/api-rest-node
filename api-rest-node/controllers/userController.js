'use strict'

//Imports
var validator = require('validator');
var User = require('../models/userModel');
var bcrypt = require('bcrypt-node');

var controller = {

    probando: function (request, response) {
        return response.status(200).send({
            message: 'Método probando'
        });
    },

    testeando: function (request, response) {
        return response.status(200).send({
            message: 'Método testeando'
        });
    },

    save: function (request, response) {
        // 1. Recoger los parametros de la petición
        var params = request.body;

        // 2. Validar los datos
        var validate_name = !validator.isEmpty(params.name);
        var validate_surname = !validator.isEmpty(params.surname);
        var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        var validate_password = !validator.isEmpty(params.password);

        console.log(validate_name, validate_surname, validate_email, validate_password);

        if (validate_name && validate_surname && validate_email && validate_password) {

            // 3. Crear objeto de usuario
            var user = new User();

            // 4. Asignar valores al objeto (al usuario)
            user.name = params.name;
            user.surname = params.surname;
            user.email = params.email.toLowerCase();
            user.role = 'ROLE_USER';
            user.image = null;

            // 5. Comprobar si el usuario existe
            User.findOne({ email: user.email }, (error, issetUser) => {

                if (error) {
                    return response.status(500).send({
                        status: 'error',
                        code: 500,
                        message: 'Error inesperado: ' + error,
                    });
                }

                if (!issetUser) {
                    // 6. Si no existe:

                    // cifrar la contrasela
                    bcrypt.hash(params.password, null, null, (error, hash) => {

                        user.password = hash;

                        // y guardar usuario
                        user.save((error, userStored) => {
                            if (error) {
                                return response.status(500).send({
                                    status: 'error',
                                    code: 500,
                                    message: 'Error al guardar el usuario'
                                });
                            }

                            if (!userStored) {
                                return response.status(400).send({
                                    status: 'error',
                                    code: 400,
                                    message: 'El usuario no se ha guardado'
                                });
                            }

                            // 7. Devolver respuesta
                            return response.status(200).send({
                                status: 'success',
                                code: 200,
                                message: 'Usuario registrado con éxito',
                                user: userStored
                            });
                        }); // Close save
                    }); // Close bcrypt
                } else {
                    return response.status(500).send({
                        status: 'error',
                        code: 500,
                        message: 'El usuario ya esta registrado'
                    });
                }
            });

        } else {
            return response.status(200).send({
                status: 'warning',
                code: 205,
                message: 'Los datos enviados no han sido validados correctamente. Por favor recibe que no hayan campos vacios o el email sea incorrecto',
                name: validate_name,
                surname: validate_surname,
                email: validate_email,
                password: validate_password
            });
        }
    }
};

module.exports = controller;