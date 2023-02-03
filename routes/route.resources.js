/**
 * returns various JSON responses from levels collection
 */
const routes = require('express').Router();
const resourcesController = require('../controllers/controller.resources');
const { validateDocumentID } = require('../middlewares/validate.document');
const { validateResource } = require('../middlewares/validate.resources');
const { checkAccess } = require('../middlewares/authorize');
const { checkValidationResult } = require('../middlewares/validation.check');


// get all resources
routes.get('/', resourcesController.getAllResources);
// get resource by id
routes.get(
	'/:id',
	validateDocumentID,
	checkValidationResult,
	resourcesController.getResourceById
);
// post
routes.post(
	'/',
	checkAccess,
	validateResource,
	checkValidationResult,
	resourcesController.createResource
);
// put
routes.put(
	'/:id',
	checkAccess,
	validateDocumentID,
	validateResource,
	checkValidationResult,
	resourcesController.updateResource
);
// delete
routes.delete(
	'/:id',
	checkAccess,
	validateDocumentID,
	checkValidationResult,
	resourcesController.deleteResource
);

module.exports = routes;
