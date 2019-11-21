'use strict'

//Imports
var validator = require('validator');
var bcrypt = require('bcrypt-node');
var fs = require('fs');
var path = require('path');
var User = require('../models/userModel');
var jwt = require('../services/jwt');

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

                        }); //--- Close save ---//
                    }); //--- Close bcrypt ---//
                } else {
                    return response.status(500).send({
                        status: 'error',
                        code: 500,
                        message: 'El usuario ya esta registrado'
                    });
                }
            }); //--- Close findOne ---//

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
    }, //--- Close method save ---//

    login: function (request, response) {

        // 1. Recoger parametros de la petición
        var params = request.body;

        // 2. Validar datos

        try {
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        } catch (error) {
            return response.status(200).send({
                message: 'Por favor envie los datos para ingresar'
            });
        }

        if (!validate_email || !validate_password) {
            return response.status(500).send({
                status: 'error',
                code: 500,
                message: 'Los datos son incorrectos'
            });
        }

        // 3. Buscar usuarios que coincidan con el email
        User.findOne({ email: params.email.toLowerCase() }, (error, user) => {
            if (error) {
                return response.status(500).send({
                    status: 'error',
                    code: 500,
                    message: 'Error al intentar identificarse'
                });
            }

            if (!user) {
                return response.status(404).send({
                    status: 'error',
                    code: 404,
                    message: 'El usuario no existe'
                });
            }

            // 4. Si lo encuentra:

            // - Comprobar la contraseña (coincidencia de email y password / bcrypt)
            bcrypt.compare(params.password, user.password, (err, check) => {

                // 5. Si es correcto:

                if (check) {
                    // - Generar token de jwt y devolverlo
                    if (params.gettoken) {

                        // 6. Devolver los datos
                        return response.status(200).send({
                            status: 'success',
                            code: 200,
                            message: 'Se ha identificado correctamente',
                            token: jwt.createToken(user)

                        });
                    } else {

                        // - Limpiar objeto o ...
                        user.password = null;

                        // ... (Datos que necesita el front-end)
                        // var user_data = {
                        //     email: user.email,
                        //     name: user.name
                        // }

                        // 6. Devolver los datos
                        return response.status(200).send({
                            status: 'success',
                            code: 200,
                            message: 'Se ha identificado correctamente, pero aún no se genera el token',
                            user

                        });
                    }

                }

                // 6. Devolver los datos
                return response.status(202).send({
                    status: 'warning',
                    code: 202,
                    message: 'Las credenciales no son correctas'
                });
            }); //--- Close bcript compare ---//

        }); //--- Close findOne ---//

    }, //--- Close method login ---//

    update: function (request, response) {

        // 0. Crear middleware para comprobar el jwt token, ponerlo en la ruta

        // 1. Recoger los datos del usuario

        var params = request.body;

        // - Validar datos
        try {
            var validate_name = !validator.isEmpty(params.name);
            var validate_surname = !validator.isEmpty(params.surname);
            var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
        } catch (error) {
            return response.status(202).send({
                status: 'warning',
                code: 202,
                message: 'Por favor envie la información que desea actualizar'
            });
        }

        // 2. Eliminar propiedades innecesarias
        delete params.password;

        var userId = request.user.sub;

        // - Comprobar que el email sea único
        if (request.user.email != params.email) {

            User.findOne({ email: params.email.toLowerCase() }, (error, user) => {
                if (error) {
                    return response.status(500).send({
                        status: 'error',
                        code: 500,
                        message: 'Error al intentar actualizar'
                    });
                }

                if (user && user.email == params.email) {
                    return response.status(202).send({
                        status: 'warning',
                        code: 202,
                        message: 'El email no puede ser modificado'
                    });
                }
            });

        } else {

            // 3. Buscar y actualizar documento
            // User.findOneAndUpdate(condición, datos a actualizar, opciones, callback);
            User.findOneAndUpdate({ _id: userId }, params, { new: true }, (error, userUpdated) => {

                if (error) {

                    return response.status(500).send({
                        message: 'Error al actualizar usuario',
                        params
                    });
                }

                if (!userUpdated) {

                    return response.status(500).send({
                        message: 'No se ha actualizado el usuario',
                        params
                    });
                }

                // 4. Devolver respuesta

                return response.status(200).send({
                    message: 'método actualizar',
                    user: userUpdated
                });
            });
        } //--- Close email compare ---//

    }, //--- Close method update ---//

    uploadAvatar: function (request, response) {

        // 1. Configurar el modulo multiparty (md) routes/userRoutesjs

        // 2. Recoger el fichero de la petición
        var file_name = 'Avatar no subido...';

        if (!request.files) {

            return response.status(404).send({
                status: 'error',
                code: 404,
                message: file_name
            });

        }

        // 3. Conseguir el nombre y la extensión del archivo
        var file_path = request.files.file0.path;
        var file_split = file_path.split('\\');

        //Nombre del archivo
        var file_name = file_split[2];
        //Extensión del archivo
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        // 4. Comprobar extensión (solo imagen), si no es valida borrar fichecho subido
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {

            fs.unlink(file_path, (err) => {
                return response.status(200).send({
                    status: 'error',
                    code: 200,
                    message: 'La extensión del archivo no es valida'
                });
            });
        } else {
            // 5. Sacar el id del usuario identificado
            var userId = request.user.sub;

            // 6. Buscar y actualizar documento bd
            User.findOneAndUpdate({ _id: userId }, { image: file_name }, { new: true }, (error, userUpdated) => {

                if(error || !userUpdated){
                    return response.status(500).send({
                        status: 'error',
                        code: 500,
                        message: 'Error al guardar Avatar',
                        file: file_name
                    });
                }
                // 7. Devolver una respuesta
                return response.status(200).send({
                    status: 'success',
                    code: 200,
                    message: 'Avatar cargado con éxito',
                    file: file_name
                });
            });

        }

    }
};

module.exports = controller;