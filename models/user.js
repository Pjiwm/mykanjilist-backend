const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    userName: {
        type: String,
        required: [true, 'user needs a username'],
        validate: [validateUserName, 'A username must be at least 5 characters long'],
        unique: [true, "username already in-use"],
    },
    email: {
        type: String,
        required: [true, 'user needs an email address'],
        validate: [validateEmail, 'Please enter a valid email address'],
        unique: [true, "email already in-use"],
    },
    password: {
        type: String,
        required: [true, 'user needs a password']
    }
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

UserSchema.plugin(require('mongoose-autopopulate'))

UserSchema.virtual('registrationDate').get(function () {
    return new Date()
})

function validateUserName(val) {
    return val.length >= 5
}

function validateEmail(val) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(val).toLowerCase())
}


module.exports = mongoose.model('User', UserSchema)

module.exports = mongoose.model('User', UserSchema)

const user = mongoose.model('user', UserSchema)
module.exports = user