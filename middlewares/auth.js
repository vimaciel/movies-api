const jwt = require('jsonwebtoken')
const config = require('config')

const errorResponse = require('../resources/error-response')

function auth(req, res, next) {
    const token = req.header('x-auth-token')
    if (!token) return res.status(401).send(errorResponse(['Access denied']))

    try {
        req.user = jwt.verify(token, config.get('jwtPrivateKey'))
        next()
    }
    catch (err) {
        console.log(err.message);
        return res.status(400).send(errorResponse(['Invalid token']))
    }
}

module.exports = auth