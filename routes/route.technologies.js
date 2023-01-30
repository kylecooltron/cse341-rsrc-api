/**
 * returns various JSON responses from levels collection
 */
const routes = require('express').Router();
const technologyController = require('../controllers/controller.technologies');
const { validateTechnology } = require('../validation/validate.technologies');

const { checkAccess } = require('../middlewares/authorize');

// get all technologies
routes.get('/', technologyController.getAllTechnologies);
// get techology by id
routes.get('/:id', technologyController.getTechnologyById);
// post - create new technology
routes.post(
	'/',
	checkAccess,
	validateTechnology,
	technologyController.createTechnology
);
// put - update technology details
routes.put(
	'/:id',
	checkAccess,
	validateTechnology,
	technologyController.updateTechnology
);
// delete
routes.delete('/:id', checkAccess, technologyController.deleteTechnology);

module.exports = routes;
