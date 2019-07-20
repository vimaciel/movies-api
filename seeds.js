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
    })

function createNewUser(data) {
    const user = new User(data)
    user.save()
}