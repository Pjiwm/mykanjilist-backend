
const bcrypt = require('bcrypt')
const User = require('../models/user')
const sign = require('../helpers/jwt.sign')

class AuthController {
    /**
     * @description - authenticates a user and gives a bearer token for authentication
     * @param {Object} body - the body of the consisting of a userName, email and password
     * @param {*} res - the token that's needed for authentication
     * @returns 
     */
    async login({ body }, res, next) {
        const foundUser = await User.findOne({ email: body.email })

        if (foundUser === null) {
            return res.status(401).json({
                message: 'Email does not exist'
            })
        }

        const isPasswordValid = await bcrypt.compare(body.password, foundUser.password)
        if (isPasswordValid) {
            const token = await sign(foundUser)
            return res.status(200).json({
                message: 'Login Success',
                token
            })
        } else {
            return res.status(401).json({
                message: 'Password is incorrect'
            })
        }
    }
}

module.exports = new AuthController()