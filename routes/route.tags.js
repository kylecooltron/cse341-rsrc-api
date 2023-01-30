/**
 * returns various JSON responses from levels collection
 */
const routes = require('express').Router();
const tagsController = require('../controllers/controller.tags');
const { tagValidate } = require('../validation/tag.validate');

// get all tags
routes.get('/', tagsController.getAllTags);
// get tag by id
routes.get('/:id', tagsController.getTagById);
// post
routes.post('/', tagsValidate, tagController.createTag);
// put
routes.put('/:id', tagsValidate, tagController.updateTag);
// delete
routes.delete('/:id', tagsController.deleteTag);


module.exports = routes;