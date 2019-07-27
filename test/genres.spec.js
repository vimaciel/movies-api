const request = require('supertest')
const app = require('../index')
const { expect, assert } = require('chai')
const { User } = require('../models/user')

describe('Genre route', () => {
    const token = new User({
        name: 'Vinicius Maciel',
        email: 'viniciusfmaciel@gmail.com',
        password: 'passwordtest'
    }).generateAuthToken()


    it('Test if has data from genres research', async () => {
        const res = await request(app)
            .get('/genres/action')

        const { body, status } = res
        assert(status, 200)
        expect(body.data).to.be.an('array')
    })

    it('Test a new genre is saved', async () => {
        const res = await request(app)
            .post('/genres')
            .set('x-auth-token', token)
            .send({
                name: 'Comedy'
            })

        const { status } = res
        assert(status, 200)
    })

    it('Test when a existed genre is saved', async () => {
        const res = await request(app)
            .post('/genres')
            .set('x-auth-token', token)
            .send({
                name: 'comedy'
            })

        const { status } = res
        assert(status, 200)
    })
})