const config = require('config')
const mongoose = require('mongoose')
const databaseConnection = config.get('database-connection')
const crypto = require('./helpers/crypto-helper')

const { User } = require('./models/user')

mongoose.connect(databaseConnection, { useNewUrlParser: true, useCreateIndex: true })
    .then(async () => {
        createNewUser({
            name: 'Vinicius Furusho Maciel',
            email: 'viniciusfmaciel@gmail.com',
            password: await crypto.hash('passwordtest') 
        })

        createNewUser({
            name: 'Test User',
            email: 'testuser@gmail.com',
            password: await crypto.hash('passwordtest') 
        })

        console.log('Initial seeds were inserted on database')
        process.exit()
    })

function createNewUser(data) {
    const user = new User(data)
    user.save()
}