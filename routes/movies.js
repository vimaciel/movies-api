const express = require('express')
const router = express.Router()
const { Movie, validateMovie } = require('../models/movie')
const { User, getUsersAsync } = require('../models/user')
const successResponse = require('../resources/success-response')
const errorResponse = require('../resources/error-response')
const validateBody = require('../middlewares/validate-body')
const { getGenreAsync } = require('../models/genre')
const validObjectId = require('../middlewares/validate-object-id')
const auth = require('../middlewares/auth')

router.get('/', async (_, res) => {
    const movies = await Movie.find().sort('title')
    res.status(200).send(successResponse(movies))
})

router.post('/', [auth, validateBody(validateMovie)], async (req, res) => {
    const { title, genre: genreItems, releaseDate, actors, summarizedPlot, youtubeTrailer, posterUrlImage, colaborators: users } = req.body
    const userAdmin = await User.findById(req.user._id, { __v: false, password: false })

    if (!userAdmin) {
        return res.status(404).send(errorResponse(['User not found']))
    }

    const [genre, validGenre] = await validateGenreItemsAsync(genreItems, res)
    const [colaborators, validColaborators] = await validateColaboratorsAsync(users, res)

    if (validGenre && validColaborators) {
        const movie = new Movie({
            title,
            genre,
            releaseDate,
            actors,
            summarizedPlot,
            youtubeTrailer,
            posterUrlImage,
            userAdmin,
            colaborators
        })

        await movie.save()

        res.status(200).send(successResponse(movie))
    }
})

router.put('/:id', [auth, validObjectId, validateBody(validateMovie)], async (req, res) => {
    const movie = await Movie.findById(req.params.id)

    if (!movie) {
        return res.status(404).send(errorResponse(['Movie not found']))
    }

    const hasPermission = await movie.hasUserPermissionToAction(req.user)

    if (!hasPermission) {
        return res.status(401).send(errorResponse(['Access denied']))
    }

    const { title, genre: genreItems, releaseDate, actors, summarizedPlot, youtubeTrailer, posterUrlImage, colaborators: users } = req.body
    const [genre, validGenre] = await validateGenreItemsAsync(genreItems, res)
    const [colaborators, validColaborators] = await validateColaboratorsAsync(users, res)

    if (validGenre && validColaborators) {
        movie.set({
            title,
            genre,
            releaseDate,
            actors,
            summarizedPlot,
            colaborators,
            youtubeTrailer,
            posterUrlImage
        })

        await movie.save()
        res.status(200).send(successResponse(movie))
    }
})

router.delete('/:id', [auth, validObjectId], async (req, res) => {
    const movie = await Movie.findById(req.params.id)

    if (!movie) {
        return res.status(404).send(errorResponse(['Movie not found']))
    }

    const hasPermission = await movie.hasUserPermissionToAction(req.user, 'delete')

    if (!hasPermission) {
        return res.status(401).send(errorResponse(['Access denied']))
    }

    await Movie.deleteOne(req.param.id)
    return res.status(200).send(successResponse(movie))
})

async function validateGenreItemsAsync(items, res) {
    return getGenreAsync(items)
        .then(genre => [genre, true])
        .catch(({ message }) => {
            res.status(404).send(errorResponse([message]))
            return [null, false]
        })
}

async function validateColaboratorsAsync(users, res) {
    // If don't have any user to verify, it's valid because colaborators are optional
    if (!users) {
        return [null, true]
    }

    return getUsersAsync(users)
        .then(users => [users, true])
        .catch(({ message }) => {
            res.status(404).send(errorResponse([message]))
            return [null, false]
        })
}

module.exports = router