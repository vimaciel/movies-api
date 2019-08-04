const request = require('supertest')
const app = require('../index')
const { expect, assert } = require('chai')
const errorResponse = require('../resources/error-response')

describe('Auth route', () => {
    it('Verify if authentication works', async () => {
        const res = await request(app)
            .post('/auth')
            .send({
                email: 'viniciusfmaciel@gmail.com',
                password: 'passwordtest'
            })
            .set('Content-Type', 'application/json')

        const { status, body } = res
        const { data } = body
        assert(status, 200)
        expect(data.token).is.not.empty
    })

    it("Test when user doesn't exist", async () => {
        const res = await request(app)
            .post('/auth')
            .send({
                email: 'user@unknown.com',
                password: 'wherever'
            })
            .set('Content-Type', 'application/json')

        const { status, body } = res
        assert(status, 400)
        expect(body).to.deep.equal(errorResponse(['E-mail or password is wrong']))
    })

    it('Test when user not found', async () => {
        const res = await request(app)
            .post('/auth')
            .send({
                email: 'viniciusfmaciel@gmail.com',
                password: 'wrongpassword'
            })
            .set('Content-Type', 'application/json')

        const { status, body } = res
        assert(status, 400)
        expect(body).to.deep.equal(errorResponse(['E-mail or password is wrong']))
    })
})