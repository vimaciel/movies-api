const request = require('supertest')
const app = require('../index')
const { expect, assert } = require('chai')

describe('Movies route', () => {
    it('Get all movies test', async () => {
        const res = await request(app)
            .get('/movies')

        const { body, status } = res
        assert(status, 200)
        expect(body.data).to.be.an('array')
    })

    it('Test the process of insert, update and delete of a single movie', async () => {
        const { token } = await authUser('viniciusfmaciel@gmail.com', 'passwordtest')
        const { _id } = await testSaveNewMovie(token)
        await testUpdateMovie(token, _id)
        await testDeleteMovie(token, _id)
    })
})

const movie = {
    title: 'Ben Hur',
    genre: ['5d34f69b4edf0917f13ab507'],
    releaseDate: '1960-01-29',
    actors: ['Charlton Heston', 'Jack Hawkins', 'Haya Harareet'],
    summarizedPlot: 'When a Jewish prince is betrayed and sent into slavery by a Roman friend, he regains his freedom and comes back for revenge.'
}

async function authUser(email, password) {
    const { body } = await request(app)
        .post('/auth')
        .send({
            email,
            password
        })
        .set('Content-Type', 'application/json')

    return body.data
}

async function testSaveNewMovie(token) {
    const { status, body } = await request(app)
        .post('/movies')
        .set('x-auth-token', token)
        .set('Content-Type', 'application/json')
        .send(movie)

    assert(status, 200)
    expect(body.data).to.be.an('object')
    return body.data
}

async function testUpdateMovie(token, movieId) {
    movie.actors.push('Stephen Boyd')
    movie.genre.push('5d337d5d7059753580d868df')

    const { status, body } = await request(app)
        .put(`/movies/${movieId}`)
        .set('x-auth-token', token)
        .set('Content-Type', 'application/json')
        .send(movie)

    assert(status, 200)
    expect(body.data).to.be.an('object')    
}

async function testDeleteMovie(token, movieId) {
    const { status, body } = await request(app)
        .delete(`/movies/${movieId}`)
        .set('x-auth-token', token)
        .set('Content-Type', 'application/json')
        .send(movie)

    assert(status, 200)
    expect(body.data).to.be.an('object')
}