/**
 * returns various JSON responses from levels collection
 */
const routes = require('express').Router();
const technologyController = require('../controllers/controller.technologies');
const { validateTechnology } = require('../middlewares/validate.technologies');
const { checkAccess } = require('../middlewares/authorize');
const { checkValidationResult } = require('../middlewares/validation.check');

// get all technologies
routes.get('/', technologyController.getAllTechnologies);
// get techology by id
routes.get('/:id', technologyController.getTechnologyById);
// post - create new technology
routes.post(
	'/',
	checkAccess,
	validateTechnology,
	checkValidationResult,
	technologyController.createTechnology
);
// put - update technology details
routes.put(
	'/:id',
	checkAccess,
	validateTechnology,
	checkValidationResult,
	technologyController.updateTechnology
);
// delete
routes.delete('/:id', checkAccess, technologyController.deleteTechnology);

module.exports = routes;
