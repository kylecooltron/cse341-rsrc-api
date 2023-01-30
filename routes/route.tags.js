/**
 * returns various JSON responses from levels collection
 */
const routes = require('express').Router();
const tagsController = require('../controllers/controller.tags');
const { tagValidate } = require('../validation/validate.tags');

// get all tags
routes.get('/', tagsController.getAllTags);
// get tag by id
routes.get('/:id', tagsController.getTagById);
// post
routes.post('/', tagValidate, tagsController.createTag);
// put
routes.put('/:id', tagValidate, tagsController.updateTag);
// delete
routes.delete('/:id', tagsController.deleteTag);


module.exports = routes;