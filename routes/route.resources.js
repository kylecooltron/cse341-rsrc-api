/**
 * returns various JSON responses from levels collection
 */
const routes = require('express').Router();
const resourcesController = require('../controllers/controller.resources');
const { resourceValidate } = require('../validation/resource.validate');
// Include Express Validator Functions


// get all Levels
routes.get('/', resourcesController.getAllResources);
// get Level by id
routes.get('/:id', resourcesController.getResourceById);
// post
routes.post('/', resourceValidate, resourcesController.createResource);
// put
routes.put('/:id', resourceValidate, resourcesController.updateResource);
// delete
routes.delete('/:id', resourcesController.deleteResource);


module.exports = routes;