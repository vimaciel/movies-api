const validateObjectId = require('../middlewares/validate-object-id')
const sinon = require('sinon')

describe('Validate object id middleware', () => {

    const res = {
        status: function () { },
        send: function () { }
    }

    const status = sinon.stub(res, 'status').returnsThis()
    const send = sinon.stub(res, 'send')

    it('Test when the object id is valid', () => {
        const next = sinon.spy()
        validateObjectId({
            params: {
                id: '5d3a12bdc3c3fee905a3ecde'
            }
        }, null, next)

        sinon.assert.called(next)
    })



    it('Test when the object id is invalid', () => {
        validateObjectId({
            params: {
                id: 'invalid-object-id'
            }
        }, res, null)

        sinon.assert.calledWith(status, 404)
        sinon.assert.calledWith(send, { success: false, messages: ['Not found.'] })
    })
})