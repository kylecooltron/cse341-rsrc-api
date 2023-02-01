/**
 * handles requests to users collection
 */

const routes = require('express').Router();
const usersController = require('../controllers/controller.users');

// get all users
routes.get('/', usersController.getAllUsers);
// checks login state and saves user info
routes.get('/auth', usersController.isAuthenticated /* #swagger.ignore = true */);

module.exports = routes;