/**
 * handles requests to users collection
 */

const routes = require('express').Router();
const usersController = require('../controllers/controller.users');
const { validateUser } = require('../middlewares/validate.users');
const { validateDocumentID } = require('../middlewares/validate.document');
const { checkValidationResult } = require('../middlewares/validation.check');
const { checkAccess } = require('../middlewares/authorize');


// checks login state and saves user info
routes.get('/', usersController.getAllUsers);
// get user by id
routes.get('/:id', validateDocumentID, usersController.getUserById);
// post
routes.post(
	'/',
	checkAccess,
	validateUser,
	checkValidationResult,
	usersController.createUser
);
// put
routes.put(
	'/:id',
	checkAccess,
	validateDocumentID,
	validateUser,
	checkValidationResult,
	usersController.updateUser
);
// delete
routes.delete(
	'/:id',
	checkAccess,
	validateDocumentID,
	checkValidationResult,
	usersController.deleteUser
);


module.exports = routes;