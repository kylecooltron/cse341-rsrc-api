const { check } = require('express-validator');

const validateUser = [
    check('profile_id')
        .exists()
        .trim()
        .escape()
        .contains('google-oauth2|'),
	check('name', 'Minimum 2 characters.')
		.exists()
		.trim()
		.escape()
		.isLength({ min: 2, max: 50 }),
];

module.exports = { validateUser };
