const express = require('express')
const router = express.Router()
const validateBody = require('../middlewares/validate-body')
const { validateGenre, Genre } = require('../models/genre')
const successResponse = require('../resources/success-response')

router.get('/:search', async (req, res) => {
    const { search } = req.params
    const genres = await Genre.find({ name: new RegExp(search) }, { __v: false })

    res.status(200).send(successResponse(genres))
})

router.post('/', validateBody(validateGenre), async (req, res) => {
    const { name } = req.body
    let genre = await Genre.findOne({ name: { $eq: name.toLowerCase() } })

    if (!genre) {
        genre = new Genre({
            name: name.toLowerCase()
        })

        await genre.save()
    }

    res.status(200).send(successResponse({
        id: genre._id,
        name: genre.name
    }))
})

module.exports = router