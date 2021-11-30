const User = require('../models/user')

class UserController {

    /**
     * Creates a new user
     * @param {*} body - the body of the request
     * @param {*} res - the response we give back after we tried to add the request object
     */
    async create({ body }, res, next) {
        const newUser = await User.create(body).catch(next)
        res.send(newUser)
    }

    /**
     * Reads from database and retrieves a kanjilist
     * @param {*} params.id - the id of the user we want to get as a response
     * @param {*} res - the user with the given id
     */
    async get({params}, res, next) {
        const foundUseer = await User.findById(params.id).catch(next)
        res.send(foundUseer)
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
            res.send({message: "deleted", object: removedUser})
    }
}

module.exports = new UserController()