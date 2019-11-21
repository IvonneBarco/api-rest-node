'use strict'

var express = require('express');
var UserController = require('../controllers/userController');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

//Rutas de prueba
router.get('/probando', UserController.probando);
router.post('/testeando', UserController.testeando);

//Rutas de usuarios
router.post('/user', UserController.save);
router.post('/login', UserController.login);
router.put('/user', md_auth.authenticated, UserController.update);

//export
module.exports = router;