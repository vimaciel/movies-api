const request = require('supertest')
const app = require('../index')
const { expect } = require('chai')

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
        expect(status).to.eq(200)
        expect(data.token).is.not.empty
    })
})