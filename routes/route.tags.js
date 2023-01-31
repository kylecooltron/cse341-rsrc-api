/**
 * returns various JSON responses from levels collection
 */
const routes = require('express').Router();
const tagsController = require('../controllers/controller.tags');
const { validateTag } = require('../middlewares/validate.tags');
const { checkAccess } = require('../middlewares/authorize');

// get all tags
routes.get('/', tagsController.getAllTags);
// get tag by id
routes.get('/:id', tagsController.getTagById);
// post
routes.post('/', checkAccess, validateTag, tagsController.createTag);
// put
routes.put('/:id', checkAccess, validateTag, tagsController.updateTag);
// delete
routes.delete('/:id', checkAccess, tagsController.deleteTag);

module.exports = routes;
