const request = require('supertest')
const app = require('../index')
const { expect, assert } = require('chai')

const movie = {
    title: 'Ben Hur',
    genre: [],
    releaseDate: '1960-01-29',
    actors: ['Charlton Heston', 'Jack Hawkins', 'Haya Harareet'],
    summarizedPlot: 'When a Jewish prince is betrayed and sent into slavery by a Roman friend, he regains his freedom and comes back for revenge.'
}

describe('Movies route', async () => {
    it('Get all movies test', async () => {
        const res = await request(app)
            .get('/movies')

        const { body, status } = res
        assert(status, 200)
        expect(body.data).to.be.an('array')
    })

    it('Test the process of insert a new movie', async () => {
        const { token } = await authUser('viniciusfmaciel@gmail.com', 'passwordtest')
        const { _id } = await searchGenre('action', token)
        movie.genre.push(_id.toString())

        const { status, body } = await request(app)
            .post('/movies')
            .set('x-auth-token', token)
            .set('Content-Type', 'application/json')
            .send(movie)

        assert(status, 200)
        expect(body.data).to.be.an('object')
        this.idMovie = body.data._id
        this.token = token
    })

    it('Test when a user is not allowed to update', async () => {
        const { token } = await authUser('paul@leroy.com', 'passwordtest')
        const { status, body } = await updateMovie(token)
        assert(status, 401)
        expect(body.success).to.be.false
    })

    it('Test the process of update a movie', async () => {
        const { status, body } = await updateMovie(this.token, this.idMovie)
        assert(status, 200)
        expect(body.data).to.be.an('object')
    })

    it('Test when a user is not allowed to delete', async () => {
        const { token } = await authUser('paul@leroy.com', 'passwordtest')
        const { status, body } = await deleteMovie(token, this.idMovie)
        assert(status, 401)
        expect(body.success).to.be.false
    })

    it('Test the process of delete a movie', async () => {
        const { status, body } = await deleteMovie(this.token, this.idMovie)
        assert(status, 200)
        expect(body.data).to.be.an('object')
    })
})

async function updateMovie(token, idMovie) {
    movie.actors.push('Stephen Boyd')
    const { _id } = await searchGenre('adventure', token)
    movie.genre.push(_id.toString())

    return await request(app)
        .put(`/movies/${idMovie}`)
        .set('x-auth-token', token)
        .set('Content-Type', 'application/json')
        .send(movie)
}

async function deleteMovie(token, idMovie) {
    return await request(app)
        .delete(`/movies/${idMovie}`)
        .set('x-auth-token', token)
        .set('Content-Type', 'application/json')
        .send(movie)
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


async function searchGenre(name, token) {
    const { body } = await request(app)
        .get(`/genres/${name}`)
        .set('x-auth-token', token)
        .set('Content-Type', 'application/json')

    return body.data[0]
}