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

module.exports.Genre = Genre
module.exports.genreSchema = genreSchema
module.exports.validateGenre = validateGenre