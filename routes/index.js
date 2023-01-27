const routes = require('express').Router();


// Base route returns login state and saves user data
routes.use('/', require('./route.users'))
// handles resource get, post, put, delete requests
routes.use('/resources', require('./route.resources'))

module.exports = routes;
