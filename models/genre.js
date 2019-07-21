const mongoose = require('mongoose')
const Joi = require('joi')

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

const Genre = mongoose.model('genres', genreSchema)

function validateGenre(req) {
    const schema = {
        name: Joi.string().required()
    }

    return Joi.validate(req, schema, { abortEarly: true })
}

function getGenreAsync(items) {
    return Promise.all(items.map(async id => {
        const genre = await Genre.findById(id, { __v: false })

        if (!genre) {
            console.log(`Genre '${id}' not found`)
            throw new Error(`Genre '${id}' not found`)
        }

        return genre
    }))
}

module.exports.Genre = Genre
module.exports.genreSchema = genreSchema
module.exports.validateGenre = validateGenre
module.exports.getGenreAsync = getGenreAsync