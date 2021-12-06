const Guide = require('../models/guide')
const jwtDecode = require('../helpers/jwt.decode')

class GuideController {

    /**
     * Creates a new guide
     * @param {*} body - the body of the request
     * @param {*} res - the response we give back after we tried to add the request object
     */
    async create({ headers, body }, res, next) {
        const token = await jwtDecode(headers.authorization)
        console.log(token)
        if (token.error !== undefined) {
            return res.status(token.code).send({ message: token.message })
        }
        body.user = token._id
        const newGuide = await Guide.create(body).catch(next)
        res.send(newGuide)
    }

    /**
     * Reads from database and retrieves a guide
     * @param {*} params.id - the id of the guide we want to get as a response
     * @param {*} res - the guide with the given id
     */
    async get({ params }, res, next) {
        const foundGuide = await Guide.findById(params.id).catch(next)
        res.send(foundGuide)
    }

    /**
     * Reads all guides from database
     * @param {*} res - all guides in database
     */
    async getAll(req, res, next) {
        const foundguides = await Guide.find().catch(next)
        res.send(foundguides)
    }

    /**
     * Updates a guide
     * @param {*} params.id - the id of the guide we want to update
     * @param {*} res - the response we give back after the guide is updated
     */
    async edit({ body, params }, res, next) {
        await Guide.findByIdAndUpdate({ _id: params.id }, body).catch(next)
        res.send(await Guide.findById(params.id))
    }
    /**
     * 
     * @param {*} params.id - the id of the guide we want to delete 
     * @param {*} res 
     */
    async delete({ params }, res, next) {
        const removedguide = await Guide.findByIdAndDelete(params.id).catch(next)
        res.send({ message: "deleted", object: removedguide })
    }

    /**
     * 
     * @param {*} params.id - the user id we get the guides from
     */
    async getByUserId({ params }, res, next) {
        const foundGuide = await Guide.find({ user: params.id }).catch(next)
        res.send(foundGuide)
    }
}

module.exports = new GuideController()