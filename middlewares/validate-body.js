const joiHelper = require('../helpers/joi-helper');
const errorResponse = require('../resources/error-response')


module.exports = (validator) => {
    return (req, res, next) => {
        const { error } = validator(req.body)

        if (error) {
            return res.status(400).send(errorResponse(joiHelper.getErrorMessages(error)))     
        }

        next()
    }
}