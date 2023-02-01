/**
 * handles requests to users collection
 */

const routes = require('express').Router();
const usersController = require('../controllers/controller.users');


// checks login state and saves user info
routes.get('/', usersController.isAuthenticated, usersController.getAllUsers /* #swagger.ignore = true */);

module.exports = routes;