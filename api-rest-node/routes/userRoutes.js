'use strict'

var express = require('express');
var UserController = require('../controllers/userController');

var router = express.Router();

//Rutas de prueba
router.get('/probando', UserController.probando);
router.post('/testeando', UserController.testeando);

//Rutas de usuarios
router.post('/create', UserController.save);

//export
module.exports = router;