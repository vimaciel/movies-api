const validateBody = require('../middlewares/validate-body')
const sinon = require('sinon')
const Joi = require('joi')

function validatePerson(req) {
    const schema = {
        name: Joi.string().required(),
        email: Joi.string().email().required()
    }

    return Joi.validate(req, schema, { abortEarly: true })
}

const res = {
    status: function () { },
    send: function () { }
}

const status = sinon.stub(res, 'status').returnsThis()
const send = sinon.stub(res, 'send')

describe('Validate body middleware', () => {
    it('Test if body object is valid', () => {
        const next = sinon.spy()

        validateBody(validatePerson)({
            body: {
                name: 'Fake User',
                email: 'fakeuser@gmail.com',
            }
        }, res, next)

        sinon.assert.called(next)
    })

    it('Test when the body object is invalid', () => {
        validateBody(validatePerson)({
            body: {
                name: 'Fake User',
            }
        }, res, null)

        sinon.assert.calledWith(status, 400)
        sinon.assert.calledWithMatch(send, { success: false })
    })
})