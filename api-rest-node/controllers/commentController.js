'user stric'

var controller = {
    add: function (request, response) {
        return response.status(200).send({
            status: 'success',
            code: 200,
            message: 'Metodo de añadir comentario'
        });
    },

    update: function (request, response) {
        return response.status(200).send({
            status: 'success',
            code: 200,
            message: 'Metodo de editar comentario'
        });
    },

    delete: function (request, response) {
        return response.status(200).send({
            status: 'success',
            code: 200,
            message: 'Metodo de eliminar comentario'
        });
    }
};

module.exports = controller;