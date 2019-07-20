const mongoose = require('mongoose')
const config = require('config')

module.exports = () => {
    const databaseConnection = config.get('database-connection')

    mongoose.connect(databaseConnection, { useNewUrlParser: true, useCreateIndex: true })
        .then(() => console.log(`Connected to ${databaseConnection}`))
}