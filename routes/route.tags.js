
/**
 * returns various JSON responses from levels collection
 */
const routes = require('express').Router();
const tagController = require('../controllers/controller.tags');
const { validateTag } = require('../middlewares/validate.tags');
const { checkValidationResult } = require('../middlewares/validation.check');
const { checkAccess } = require('../middlewares/authorize');

// get all tags
routes.get('/', tagController.getAllTags);
// get tag by id
routes.get(
    '/:id',
    tagController.getTagById
);
// post
routes.post(
    '/',
    checkAccess,
    validateTag,
    checkValidationResult,
    tagController.createTag
);
// put
routes.put(
    '/:id',
    checkAccess,
    validateTag,
    checkValidationResult,
    tagController.updateTag
);
// delete
routes.delete(
    '/:id',
    checkAccess,
    tagController.deleteTag
);


module.exports = routes;