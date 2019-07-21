const express = require('express')
const router = express.Router()
const Join = require('joi')
const { User } = require('../models/user')
const successResponse = require('../resources/success-response')
const errorResponse = require('../resources/error-response')
const validateBody = require('../middlewares/validate-body')
const cryptoHelper = require('../helpers/crypto-helper')

router.post('/', validateBody(validateAuth), async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    
    if (!user) {
        return res.status(400).send(errorResponse(['E-mail or password is wrong']))
    }

    const valid = await cryptoHelper.hashMatches(password, user.password)

    if (!valid) {
        return res.status(400).send(errorResponse(['E-mail or password is wrong']))
    }

    const token = user.generateAuthToken()
    res.status(200).send(successResponse({ token }))
})

function validateAuth(req) {
    const schema = {
        email: Join.string().required().email(),
        password: Join.string().required()
    }

    return Join.validate(req, schema, { abortEarly: true })
}

module.exports = router