
/**
 * returns various JSON responses from levels collection
 */
const routes = require('express').Router();
const tagController = require('../controllers/controller.tags');
const { validateTag } = require('../middlewares/validate.tags');

// get all tags
routes.get('/', tagController.getAllTags);
// get tag by id
routes.get('/:id', tagController.getTagById);
// post
routes.post('/', validateTag, tagController.createTag);
// put
routes.put('/:id', validateTag, tagController.updateTag);
// delete
routes.delete('/:id', tagController.deleteTag);


module.exports = routes;