/**
 * returns various JSON responses from levels collection
 */
const routes = require('express').Router();
const resourcesController = require('../controllers/controller.resources');
const { validateResource } = require('../middlewares/validate.resources');
const { checkAccess } = require('../middlewares/authorize');

// get all resources
routes.get('/', resourcesController.getAllResources);
// get resource by id
routes.get('/:id', resourcesController.getResourceById);
// post
routes.post(
	'/',
	checkAccess,
	validateResource,
	resourcesController.createResource
);
// put
routes.put(
	'/:id',
	checkAccess,
	validateResource,
	resourcesController.updateResource
);
// delete
routes.delete('/:id', checkAccess, resourcesController.deleteResource);

module.exports = routes;
