const { genreSchema } = require('./genre')
const { userSchema } = require('./user')
const mongoose = require('mongoose')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi);

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: [genreSchema],
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    actors: {
        type: [String],
        required: true
    },
    summarizedPlot: {
        type: String,
        required: true
    },
    userAdmin: {
        type: userSchema,
        required: true,
        unique: false
    },
    colaborators: {
        type: [userSchema]
    },
    youtubeTrailer: String,
    posterUrlImage: String
}, { autoIndex: false })

function validateMovie(req) {
    const schema = {
        title: Joi.string().required(),
        genre: Joi.array().items(Joi.objectId().required()),
        releaseDate: Joi.date().required(),
        actors: Joi.array().items(Joi.string().required()),
        summarizedPlot: Joi.string().required(),
        colaborators: Joi.array().items(Joi.objectId()),
        youtubeTrailer: Joi.string(),
        posterUrlImage: Joi.string()
    }

    return Joi.validate(req, schema, { abortEarly: true })
}

const Movie = mongoose.model('movies', movieSchema)

module.exports.Movie = Movie
module.exports.validateMovie = validateMovie