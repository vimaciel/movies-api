const express = require('express')

const auth = require('../routes/auth')
const movies = require('../routes/movies')

module.exports = (app) => {
    app.use(express.json())

    app.use('/auth', auth)
    app.use('/movies', movies)
}