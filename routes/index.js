const routes = require('express').Router();

// Note: base route presents app from the view folder (custom front-end), see server.js

// Auth0 redirects to /auth as callback
routes.use('/auth', require('./route.auth'));

// handles resource get, post, put, delete requests
routes.use('/resources', require('./route.resources'));
routes.use('/technologies', require('./route.technologies'));
routes.use('/tags', require('./route.tags'));
routes.use('/users', require('./route.users'));

module.exports = routes;
