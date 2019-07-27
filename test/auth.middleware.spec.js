const { expect } = require('chai')
const sinon = require('sinon')
const auth = require('../middlewares/auth')
const { User } = require('../models/user')
const errorResponse = require('../resources/error-response')

describe('Auth middleware', function () {
    const fakeUser = new User({
        name: 'Fake User',
        email: 'fakeuser@gmail.com',
        password: 'fakepassword'
    })

    const req = {
        header: function () { }
    }

    const res = {
        status: function () {  },
        send: function () { }
    }    

    const header = sinon.stub(req, 'header')
    const status = sinon.stub(res, 'status').returnsThis()
    const send = sinon.stub(res, 'send')

    it('Test if user is allowed to go forward', () => {
        const next = sinon.spy()
        header.returns(fakeUser.generateAuthToken())

        auth(req, {}, next)
        expect(header.called).to.be.true
        expect(req.user).to.be.an('object')
        expect(req.user).to.have.property('_id')
        expect(next.called).to.be.true
    })

    it('Test when user has a access denied', () => {
        header.returns(null)
        auth(req, res)       

        sinon.assert.calledWith(status, 401)
        sinon.assert.calledWith(send, errorResponse(['Access denied']))
    })

    it('Test when the token verification fails', () => {
        header.returns('invalidtoken')
        auth(req, res)

        sinon.assert.calledWith(status, 400)
        sinon.assert.calledWith(send, errorResponse(['Invalid token']))
    })
})