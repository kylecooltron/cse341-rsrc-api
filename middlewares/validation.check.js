
const { validationResult } = require('express-validator');


const checkValidationResult = async (req, res, next) => {
    /**
     * Checks result from express validation middleware
     * sends error status if any errors were found
     * otherwise continues to next handler
     */
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
    } else {
        next();
    }
}


module.exports = { checkValidationResult };
