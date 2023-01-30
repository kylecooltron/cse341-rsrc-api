const { check } = require('express-validator');

const validateTechnology = [
	check('name', 'Minimum 3 characters.')
		.exists()
		.trim()
		.escape()
		.isLength({ min: 3, max: 50 }),
	check('description', 'Minimum 3 characters.')
		.exists()
		.trim()
		.escape()
		.isLength({ min: 3, max: 250 }),
	check('category', 'Minimum 3 characters.')
		.exists()
		.trim()
		.escape()
		.isLength({ min: 3, max: 50 }),
	check('date_created', 'Must be valid date or null').optional().toDate(),
	check('last_modified', 'Must be valid date or null').optional().toDate(),
];

module.exports = { validateTechnology };
