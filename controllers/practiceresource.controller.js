const PracticeResource = require('../models/practiceresource')

class PracticeResourceController {

    /**
     * Creates a new kanjilist
     * @param {*} body - the body of the request
     * @param {*} res - the response we give back after we tried to add the request object
     */
    async create({ body }, res, next) {
        const newKanjiList = await PracticeResource.create(body).catch(next)
        res.send(newKanjiList)
    }

    /**
     * Reads from database and retrieves a practice resource
     * @param {*} params.id - the id of the practice resource we want to get as a response
     * @param {*} res - the practice resource with the given id
     */
    async get({params}, res, next) {
        const foundPracticeResource = await PracticeResource.findById(params.id).catch(next)
        res.send(foundPracticeResource)
    }

    /**
     * Reads all practice resources from database
     * @param {*} res - all practice resources in database
     */
    async getAll(req, res, next) {
        const foundPracticeResources = await PracticeResource.find().catch(next)
        res.send(foundPracticeResources)
    }

    /**
     * Updates a practice resource
     * @param {*} params.id - the id of the practice resource we want to update
     * @param {*} res - the response we give back after the practice resource is updated
     */
    async edit({ body, params }, res, next) {
        await PracticeResource.findByIdAndUpdate({ _id: params.id }, body).catch(next)
        res.send(await PracticeResource.findById(params.id))
    }
    /**
     * 
     * @param {*} params.id - the id of the practice resource we want to delete 
     * @param {*} res 
     */
    async delete({ body, params }, res, next) {
        const removedPracticeResource = await PracticeResource.findByIdAndDelete(params.id).catch(next)
            res.send({message: "deleted", object: removedPracticeResource})
    }
}

module.exports = new PracticeResourceController()