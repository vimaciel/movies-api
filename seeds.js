const config = require('config')
const mongoose = require('mongoose')
const databaseConnection = config.get('database-connection')
const crypto = require('./helpers/crypto-helper')
const faker = require('faker')

const { User } = require('./models/user')
const { Genre } = require('./models/genre')

init()

async function init() {
    console.log('Running Seed function')
    await mongoose.connect(databaseConnection, { useNewUrlParser: true, useCreateIndex: true }, () => console.log(`Connected to ${databaseConnection}`))

    await createNewUser({
        name: 'Vinicius Furusho Maciel',
        email: 'viniciusfmaciel@gmail.com',
        password: await crypto.hash('passwordtest')
    })

    await createNewUser({
        name: 'Paul Leroy',
        email: 'paul@leroy.com',
        password: await crypto.hash('passwordtest')
    })

    await createFakeUsers(2)
    await createGenres('action', 'adventure', 'comedy', 'crime', 'drama', 'fantasy', 'historical', 'horror', 'mystery', 'romance', 'sci-fi', 'thriller', 'western')

    console.log('Seed function finished')
    process.exit()

}

async function createFakeUsers(createHowManyUsers = 1) {
    for (let i = 0; i < createHowManyUsers; i++) {
        const user = new User({
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: await crypto.hash(faker.internet.password())
        })

        await user.save()
    }
}

async function createNewUser(data) {
    const user = new User(data)
    return await user.save()
}

async function createGenres(...genres) {
    for (const name of genres) {
        let genre = new Genre({
            name
        })

        await genre.save()
    }
}