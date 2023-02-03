const { check } = require('express-validator');

const validateResource = [
	check('title', 'Minimum 3 characters.')
		.exists()
		.trim()
		.escape()
		.isLength({ min: 3, max: 50 }),
	check('subject', 'Minimum 3 characters.')
		.exists()
		.trim()
		.escape()
		.isLength({ min: 3, max: 50 }),
	check('description', 'Minimum 3 characters.')
		.exists()
		.trim()
		.escape()
		.isLength({ min: 3, max: 250 }),
	check('likes', 'Must be numeric or null').optional().trim().isNumeric(),
	check('date_created', 'Must be valid date or null').optional().toDate(),
	check('last_modified', 'Must be valid date or null').optional().toDate(),
	// array of lesson #'s
	check(
		'lesson_numbers',
		'Must specify lesson numbers this resource relates to'
	).isArray({ min: 1 }),
	check('lesson_numbers.*').trim().escape(),
	// array of links
	check('links', 'Must be an array of link objects').isArray(),
	check('links.*.title').exists().trim().escape().isLength({ min: 3 }),
	check('links.*.category')
		.trim()
		.escape()
		.isIn(['Forum Post', 'Website', 'Video']),
	check('links.*.url').exists().trim().escape().isURL().isLength({ min: 3 }),
	// search tags
	check('search_tags', 'Must be an array of tag objects').isArray(),
	check('search_tags.*').trim().escape(),
	// contributing authors
	check(
		'contributing_students',
		'Must be an array of user profile_id values'
	).isArray(),
	check('contributing_students.*').trim().escape(),
	// featured languages
	check(
		'featured_technologies',
		'Must be an array of featured_technology objects'
	).isArray(),
	check('featured_technologies.*').trim().escape(),
];

module.exports = { validateResource };
