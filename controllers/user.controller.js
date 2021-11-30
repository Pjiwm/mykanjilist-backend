const User = require('../models/user')
const bcrypt = require('bcrypt')
const sign = require('../helpers/jwt.sign')
const passwordCheck = require('../helpers/password.check')
const duplicateCheck = require('../helpers/duplicate.user.check')

class UserController {

    /**
     * Creates a new user
     * @param {*} body - the body of the request
     * @param {*} res - the response we give back after we tried to add the request object
     */
    async create({ body }, res, next) {
        const hashedPassword = await bcrypt.hash(body.password, 10)
        if (!passwordCheck(body.password)) {
            return res.status(400).json({
                message: "Password needs to be at least 8 chacters long and contain a number"
            })
        }

        body.password = hashedPassword
        const duplicateEmail = await duplicateCheck({ email: body.email })
        const duplicateUserName = await duplicateCheck({ userName: body.userName })

        if (duplicateEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }
        if (duplicateUserName) {
            return res.status(400).json({ message: "Username already exists" })
        }

        const newUser = await User.create(body).catch(next)

        const token = await sign(newUser)
        res.send({
            _id: newUser._id,
            userName: newUser.userName,
            email: newUser.email,
            token: token
        })
    }

    /**
     * Reads from database and retrieves a kanjilist
     * @param {*} params.id - the id of the user we want to get as a response
     * @param {*} res - the user with the given id
     */
    async get({ params }, res, next) {
        const foundUser = await User.findById(params.id).catch(next)
        res.send(foundUser)
    }

    /**
     * Updates a user
     * @param {*} params.id - the id of the user we want to update
     * @param {*} res - the response we give back after the user is updated
     */
    async edit({ body, params }, res, next) {
        await User.findByIdAndUpdate({ _id: params.id }, body).catch(next)
        res.send(await User.findById(params.id))
    }
    /**
     * 
     * @param {*} params.id - the id of the user we want to delete 
     * @param {*} res 
     */
    async delete({ body, params }, res, next) {
        const removedUser = await User.findByIdAndDelete(params.id).catch(next)
        res.send({ message: "deleted", object: removedUser })
    }

}

module.exports = new UserController()