/**
 * returns various JSON responses from levels collection
 */
const routes = require('express').Router();
const tagController = require('../controllers/controller.tags');
const { validateTag } = require('../middlewares/validate.tags');
const { validateDocumentID } = require('../middlewares/validate.document');
const { checkValidationResult } = require('../middlewares/validation.check');
const { checkAccess } = require('../middlewares/authorize');

// get all tags
routes.get('/', tagController.getAllTags);
// get tag by id
routes.get('/:id', validateDocumentID, tagController.getTagById);
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
	validateDocumentID,
	validateTag,
	checkValidationResult,
	tagController.updateTag
);
// delete
routes.delete(
	'/:id',
	checkAccess,
	validateDocumentID,
	checkValidationResult,
	tagController.deleteTag
);

module.exports = routes;
