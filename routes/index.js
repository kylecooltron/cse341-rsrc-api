const routes = require('express').Router();

// Base route returns login state and saves user data
routes.use('/', require('./route.auth'));
// handles resource get, post, put, delete requests
routes.use('/resources', require('./route.resources'));
routes.use('/technologies', require('./route.technologies'));
routes.use('/tags', require('./route.tags'));
routes.use('/users', require('./route.users'));

module.exports = routes;
