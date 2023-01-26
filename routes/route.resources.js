/**
 * returns various JSON responses from levels collection
 */
const routes = require('express').Router();
const resourcesController = require('../controllers/controller.resources');
const { resourceValidate } = require('../validation/resource.validate');

// get all resources
routes.get('/', resourcesController.getAllResources);
// get resource by id
routes.get('/:id', resourcesController.getResourceById);
// post
routes.post('/', resourceValidate, resourcesController.createResource);
// put
routes.put('/:id', resourceValidate, resourcesController.updateResource);
// delete
routes.delete('/:id', resourcesController.deleteResource);


module.exports = routes;