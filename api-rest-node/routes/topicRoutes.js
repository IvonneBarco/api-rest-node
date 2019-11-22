'use strict'

var express = require('express');
var TopicController = require('../controllers/topicController');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

//Rutas
router.get('/test', TopicController.test);
router.post('/topic', md_auth.authenticated, TopicController.save);
router.get('/topics/:page?', TopicController.getTopics);
router.get('/user-topics/:user', TopicController.getTopicsByUser);
router.get('/topic/:id', TopicController.getTopic);

module.exports = router;