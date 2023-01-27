const { check } = require('express-validator');

const resourceValidate = [
    check('title', 'Minimum 3 characters.').exists().trim().escape().isLength({ min: 3, max: 50 }),
    check('subject', 'Minimum 3 characters.').exists().trim().escape().isLength({ min: 3, max: 50 }),
    check('description', 'Minimum 3 characters.').exists().trim().escape().isLength({ min: 3, max: 250 }),
    check('likes').trim().isNumeric(),
    check('date_created').toDate(),
    check('last_modified').toDate(),
    // array of lesson #'s
    check('lesson_numbers', 'Must specify lesson numbers this resource relates to').isArray({ min: 1 }),
    check('lesson_numbers.*').trim().escape(),
    // array of links
    check('links').isArray(),
    check('links.*.title').exists().trim().escape().isLength({ min: 3 }),
    check('links.*.category').trim().escape().isIn([
        'Forum Post', 'Website', "Video"
    ]),
    check('links.*.url').exists().trim().escape().isURL().isLength({ min: 3 }),
    // search tags
    check('search_tags').isArray(),
    check('search_tags.*').trim().escape(),
    // contributing authors
    check('contributing_students').isArray(),
    check('contributing_students.*').trim().escape(),
    // featured languages
    check('featured_technologies').isArray(),
    check('featured_technologies.*').trim().escape(),
]


/*
const tagsValidate = []

const featuredTechnologiesValidate = []

// const userValidate = []

*/


// .isBoolean


module.exports = { resourceValidate };