const { check } = require('express-validator');

const resourceValidate = [
    check('name', 'Minimum 3 characters.').exists().isLength({ min: 3 }).trim().escape(),
]

/*
check('name', 'message')
check('name.*.name)

.isBoolean
.trim
.excape
.isIn([])
.isLength({ min: 3 })
.isNumeric
.exists()
*/

module.exports = { resourceValidate };