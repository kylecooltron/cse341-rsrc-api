const { param } = require('express-validator');
const { ObjectId } = require('mongodb');


/**
 * Validation for an expected parameter "id" of type ObjectId (mongo _id)
 */
const validateDocumentID = [
	param('id').exists().custom(ID => {
		new ObjectId(ID);
		return true;
	}),
];


module.exports = { validateDocumentID };
