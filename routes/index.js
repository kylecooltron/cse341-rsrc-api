const routes = require('express').Router();

routes.use('/resources', require('./route.resources'))

module.exports = routes;
