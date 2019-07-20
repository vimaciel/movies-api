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
    return jwt.sign({ _id: this._id }, config.get('privateKey'))
}

const User = mongoose.model('users', userSchema)

module.exports.User = User