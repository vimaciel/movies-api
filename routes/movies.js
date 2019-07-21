const express = require('express')
const router = express.Router()
const { Movie, validateMovie } = require('../models/movie')
const successResponse = require('../resources/success-response')
const errorResponse = require('../resources/error-response')
const validateBody = require('../middlewares/validate-body')
const { getGenreAsync } = require('../models/genre')

router.get('/', (_, res) => {
    const movies = Movie.find().sort('title')
    res.status(200).send(successResponse(movies))
})

router.post('/', validateBody(validateMovie), async (req, res) => {
    const { title, genre: genreItems, releaseDate, actors, summarizedPlot, youtubeTrailer, posterUrlImage } = req.body

    const genre = await validateGenreItemsAsync(genreItems, res)

    if (genre) {
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

        res.status(400).send(errorResponse(movie))
    }
})

async function validateGenreItemsAsync(items, res) {
    return getGenreAsync(items)
        .then(genre => genre)
        .catch(({ message }) => {
            res.status(400).send(errorResponse([message]))
            return false;
        })
}

module.exports = router