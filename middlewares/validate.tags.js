const { check } = require('express-validator');

const validateTag = [
	check('name', 'Minimum 2 characters.')
		.exists()
		.trim()
		.escape()
		.isLength({ min: 2, max: 50 }),
	// usage
	check('usage', 'Must be an array of usage objects').isArray(),
	check('usage.*').trim().escape(),
];

module.exports = { validateTag };
