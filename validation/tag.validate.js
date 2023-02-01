const { check } = require('express-validator');

const tagValidate = [
    check('name', 'Minimum 3 characters.').exists().trim().escape().isLength({ min: 3, max: 50 }),
    // usage
    check('usage', 'Must be an array of usage objects').isArray(),
    check('usage.*').trim().escape(),
]


module.exports = { tagValidate };