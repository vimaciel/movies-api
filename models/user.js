const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('config')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    }
})

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'))
}

const User = mongoose.model('users', userSchema)

function getUsersAsync(users) {
    return Promise.all(users.map(async id => {
        const user = await User.findById(id, { __v: false, password: false })

        if (!user) {
            throw new Error(`User '${id}' not found`)
        }

        return user
    }))
}

module.exports.User = User
module.exports.userSchema = userSchema
module.exports.getUsersAsync = getUsersAsync