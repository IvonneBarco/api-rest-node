'user stric'

//Imports
var Topic = require('../models/topicModel');
var validator = require('validator');

var controller = {
    add: function (request, response) {

        // 1. Recoger el id del topic de la url
        var topicId = request.params.topicId;

        // 2. Find por id del topic
        Topic.findById(topicId).exec((error, topic) => {

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
                    message: 'No existe el tema'
                });
            }

            // 3. Comprobar objeto usuario y validar datos
            if (request.body.content) {

                //validar datos
                try {
                    var validate_content = !validator.isEmpty(request.body.content);

                } catch (error) {
                    return response.status(202).send({
                        status: 'warning',
                        code: 202,
                        message: 'No has realizado ningún comentario'
                    });
                }

                if (validate_content) {

                    var comment = {
                        user: request.user.sub,
                        content: request.body.content
                    };

                    // 4. En la propiedad comments del objeto resultante hacer un push
                    topic.comment.push(comment);

                    // 5. Guardar el topic completo

                    topic.save((error) => {
                        if (error) {
                            return response.status(500).send({
                                status: 'warning',
                                code: 500,
                                message: 'Error al guardar el comentario'
                            });
                        }

                        // 6. Devolver una respuesta
                        return response.status(200).send({
                            status: 'success',
                            code: 200,
                            message: 'El comentario se ha agregado',
                            topic
                        });
                    });

                } else {
                    return response.status(202).send({
                        status: 'warning',
                        code: 202,
                        message: 'No se ha validado los datos de comentario'
                    });
                }
            } // --- Close obj content and user --- //

        }); // --- Close add Topic findById --- //

    }, // --- Close add method --- //

    update: function (request, response) {

        // 1. Conseguir id de comentario que llega de la url
        var commentId = request.params.commentId;

        // 2. Recoger datos del body y validar
        var params = request.body;

        //validar datos
        try {
            var validate_content = !validator.isEmpty(request.body.content);

        } catch (error) {
            return response.status(202).send({
                status: 'warning',
                code: 202,
                message: 'No has realizado ningún comentario'
            });
        }

        if (validate_content) {
            // 3. Find and update de subdocumento de un comentario
            Topic.findOneAndUpdate(
                { 'comment._id': commentId },
                {
                    '$set': {
                        'comment.$.content': params.content
                    }
                },
                { new: true },
                (error, commentTopicUpdate) => {
                    if (error) {
                        return response.status(500).send({
                            status: 'error',
                            code: 500,
                            message: 'Error en la petición'
                        });
                    }

                    if (!commentTopicUpdate) {
                        return response.status(404).send({
                            status: 'error',
                            code: 404,
                            message: 'No existe el comentario'
                        });
                    }

                    // 4. Devolver los datos
                    return response.status(200).send({
                        status: 'success',
                        code: 200,
                        message: 'Comentario editado!',
                        commentTopicUpdate
                    });

                });


        }

    }, // --- Close update method --- //

    delete: function (request, response) {
        return response.status(200).send({
            status: 'success',
            code: 200,
            message: 'Metodo de eliminar comentario'
        });
    } // --- Close delete method --- //
};

module.exports = controller;