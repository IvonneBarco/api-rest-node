'use strict'

//Importar Mongoose
var mongoose = require('mongoose');

//Define las propuedades que tendrá el objeto
var Schema = mongoose.Schema;

// Modelo de COMMENT
var CommentSchema = Schema({
    content: String,
    date: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' },
});

var Comment = mongoose.model('Comment', CommentSchema);

//Esquema
var TopicSchema = Schema({
    title: String,
    content: String,
    code: String,
    lenguage: String,
    date: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' },
    comment: [CommentSchema]
});

//Exportar modulo
module.exports = mongoose.model('Topic', TopicSchema);