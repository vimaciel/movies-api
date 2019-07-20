const mongoose = require('mongoose')

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

const Genre = mongoose.model('genres', genreSchema)

async function getValidGenresAsync(genres) {
    return await Promise.all(genres.map(async name => {
        let genre = await Genre.findOne({ name: { $eq: name.toLowerCase() } }, { __v: false })

        if (!genre) {
            genre = new Genre({
                name: name.toLowerCase()
            })

            await genre.save()
        }

        return genre
    }))
}

module.exports.Genre = Genre
module.exports.genreSchema = genreSchema
module.exports.getValidGenresAsync = getValidGenresAsync