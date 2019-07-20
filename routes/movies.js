const express = require('express')
const router = express.Router()
const { Movie, validateMovie } = require('../models/movie')
const successResponse = require('../resources/success-response')
const errorResponse = require('../resources/error-response')
const validateBody = require('../middlewares/validateBody')

router.get('/', (_, res) => {
    const movies = Movie.find().sort('title')
    res.status(200).send(successResponse(movies))
})

router.post('/', validateBody(validateMovie), async (req, res) => {
    const { title, genre, releaseDate, actors, summarizedPlot, youtubeTrailer, posterUrlImage } = req.body

    const movie = new Movie({
        title,
        genre,
        releaseDate,
        actors,
        summarizedPlot,
        youtubeTrailer,
        posterUrlImage
    })

    await movie.save()
    res.status(200).send(successResponse(movie))
})


module.exports = router