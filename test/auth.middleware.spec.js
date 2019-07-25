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

    const reqHeaderStub = sinon.stub(req, 'header')

    it('Test if user is allowed to go forward', () => {
        const next = sinon.spy()
        reqHeaderStub.returns(fakeUser.generateAuthToken())

        auth(req, {}, next)
        expect(reqHeaderStub.called).to.be.true
        expect(req.user).to.be.an('object')
        expect(req.user).to.have.property('_id')
        expect(next.called).to.be.true
    })

    it('Test when user has a access denied', () => {
        reqHeaderStub.returns(null)
        
        const mock = sinon.mock(res)        
        mock.expects('status').returnsThis().withArgs(401)
        mock.expects('send').once().withExactArgs(errorResponse(['Access denied']))

        auth(req, res)
        mock.verify()
        expect(reqHeaderStub.called).to.be.true
    })
})