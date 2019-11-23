'user strict'

var validator = require('validator');
var Topic = require('../models/topicModel');

var controller = {

    test: function (request, response) {
        return response.status(200).send({
            message: 'Topics test'
        });
    },

    save: function (request, response) {

        // 1. Recoger parametros por POST
        var params = request.body;

        // 2. Validar datos
        try {

            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_language = !validator.isEmpty(params.language);

        } catch (ex) {

            return response.status(205).send({
                status: 'warning',
                code: 205,
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_title && validate_content && validate_language) {

            // 3. Crear objeto a guardar
            var topic = new Topic();

            // 4. Asignar valores
            topic.title = params.title;
            topic.content = params.content;
            topic.code = params.code;
            topic.language = params.language,
                topic.user = request.user.sub;

            // 5. Guardar el topic

            topic.save((error, topicStored) => {

                if (error || !topicStored) {
                    // 6. Devolver una respuesta
                    return response.status(404).send({
                        status: 'error',
                        code: 200,
                        message: 'El tema no se ha guardado'
                    });
                }

                // 6. Devolver una respuesta
                return response.status(200).send({
                    status: 'success',
                    code: 200,
                    message: 'Tema guardado con éxito',
                    topic: topicStored
                });

            });

        } else {
            return response.status(205).send({
                status: 'error',
                code: 205,
                message: 'Los datos enviados no han sido validados correctamente. Por favor revise que no hayan campos vacios',
                title: validate_title,
                content: validate_content,
                language: validate_language
            });
        }

    }, // --- Close save method --- //

    getTopics: function (request, response) {

        // 0. Importar mongoose paginate en el modelo

        // 1. Cargar la libreria de paginación en la clase        

        // 2. Recoger la página actual
        if (!request.params.page || request.params.page == '0' || request.params.page == 0 || request.params.page == null || request.params.page == undefined) {
            var page = 1
        } else {
            var page = parseInt(request.params.page);
        }

        // 3. Indicar las opciones de paginación
        var options = {
            sort: { date: -1 }, // del más nuevo al más antiguo
            populate: 'user', // datos del usuario
            limit: 5, // topic por página,
            page: page //página que se esta listando
        }

        // 4. Find paginado
        Topic.paginate({}, options, (error, topics) => {

            if (error) {
                return response.status(500).send({
                    status: 'error',
                    code: 500,
                    message: 'Error al hacer la consulta'
                });
            }

            if (!topics) {
                return response.status(404).send({
                    status: 'error',
                    code: 404,
                    message: 'No se ha encontrado topics'
                });
            }

            // 5. Devolver resultado (topics, total de topic, total de paginas)        
            return response.status(200).send({
                status: 'success',
                code: 200,
                message: 'Lista de topics',
                topics: topics.docs,
                totalDocs: topics.totalDocs,
                totalPages: topics.totalPages
            });
        });

    }, // --- Close getTopics method --- //

    getTopicsByUser: function (request, response) {

        // 1. conseguir el id del usuario
        var userId = request.params.user;

        // 2. Find con una condición de usuario
        Topic.find({
            user: userId
        })
            .sort([['date', 'descending']])
            .exec((error, topics) => {

                if (error) {
                    return response.status(500).send({
                        status: 'error',
                        code: 500,
                        message: 'Error en la petición'
                    });
                }

                if (!topics) {
                    return response.status(404).send({
                        status: 'error',
                        code: 404,
                        message: 'No hay temas para buscar'
                    });
                }

                // 3. Devolver un resultado
                return response.status(200).send({
                    status: 'success',
                    code: 200,
                    message: 'Lista de topics por usuario',
                    topics
                });
            });

    },// --- Close getTopicsByUser method --- //

    getTopic: function (request, response) {

        // 1. Sacar el id del topic de la url
        var topicId = request.params.id;

        // 2. Find por id del topic
        Topic.findById(topicId)
            .populate('user')
            .exec((error, topic) => {
                if (error) {
                    return response.status(500).send({
                        status: 'error',
                        code: 500,
                        message: 'Error en la petición'
                    });
                }

                if (!topic) {
                    return response.status(404).send({
                        status: 'error',
                        code: 404,
                        message: 'El tema no se ha encontrado'
                    });
                }

                // 3. Devolver resultado
                return response.status(200).send({
                    status: 'success',
                    code: 200,
                    message: 'Información de topic',
                    topic
                });
            });


    },// --- Close getTopicsByUser method --- //

    update: function (request, response) {

        // 1. Recoger el id del topic
        var topicId = request.params.id;

        // 2. Recoger los datos que llegan desde post
        var params = request.body;

        // 3. Validar datos
        try {

            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_language = !validator.isEmpty(params.language);

        } catch (ex) {

            return response.status(205).send({
                status: 'warning',
                code: 205,
                message: 'Faltan datos por enviar'
            });
        }

        if (validate_title && validate_content && validate_language) {
            // 4. Montar un json con los datos modificables
            var update = {
                title: params.title,
                content: params.content,
                code: params.code,
                language: params.language
            }

            // 5. Find and update del topic por id y por id de usuario
            Topic.findOneAndUpdate({ _id: topicId, user: request.user.sub }, update, { new: true }, (error, topicUpdate) => {

                if (error) {
                    return response.status(500).send({
                        status: 'error',
                        code: 500,
                        message: 'Error en la petición'
                    });
                }

                if (!topicUpdate) {
                    return response.status(500).send({
                        status: 'error',
                        code: 500,
                        message: 'No se ha actualizado el tema'
                    });
                }

                return response.status(200).send({
                    status: 'success',
                    code: 200,
                    message: 'Tema actualziado con éxito',
                    topicUpdate
                });
            });

        } else {
            return response.status(202).send({
                status: 'warning',
                code: 202,
                message: 'La validación no es correcta'
            });
        }
    }, // --- Close update method --- //

    delete: function (request, response) {

        // 1. Recoger el id del topic por la url
        var topicId = request.params.id;

        // 2. Find and delete por topicID y por userID
        Topic.findOneAndDelete({ _id: topicId, user: request.user.sub }, (error, topicRemove) => {

            if (error) {
                // 3. Devolver respuesta
                return response.status(200).send({
                    status: 'success',
                    code: 200,
                    message: 'Error en la petición'
                });
            }

            if (!topicRemove) {
                // 3. Devolver respuesta
                return response.status(200).send({
                    status: 'success',
                    code: 200,
                    message: 'No se ha eliminado el tema'
                });
            }

            // 3. Devolver respuesta
            return response.status(200).send({
                status: 'success',
                code: 200,
                message: 'Topic eliminado',
                topicRemove
            });
        });
    },// --- Close delete method --- //

    search: function (request, response) {

        // 1. Sacar string a buscar de la url
        var searchString = request.params.search;

        // 2. Find or
        // $or --> permite evaluar condiciones con and o con or
        // $regex --> expresión regular
        // $options --> permite comprobar si hay una coincidencia 
        Topic.find({
            "$or": [
                { "title": { "$regex": searchString, "$options": "i" } },
                { "content": { "$regex": searchString, "$options": "i" } },
                { "language": { "$regex": searchString, "$options": "i" } },
                { "code": { "$regex": searchString, "$options": "i" } }
            ]
        }).sort([['date', 'descending']])
            .exec((error, topic) => {

                if (error) {
                    return response.status(500).send({
                        status: 'error',
                        code: 500,
                        message: 'Error en la petición'
                    });
                }

                if (!topic) {
                    return response.status(404).send({
                        status: 'error',
                        code: 404,
                        message: 'No hay temas disponibles'
                    });
                }

                // 3. Devolver resultado
                return response.status(200).send({
                    status: 'success',
                    code: 200,
                    message: 'Se ha encontrado las siguientes coincidencias',
                    topic
                });
            });

    }
};

module.exports = controller;