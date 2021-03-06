const KanjiList = require('../models/kanjilist')
const jwtDecode = require('../helpers/jwt.decode')

class GuideController {

    /**
     * Creates a new kanjilist
     * @param {*} body - the body of the request
     * @param {*} res - the response we give back after we tried to add the request object
     */
    async create({ headers, body }, res, next) {
        const token = await jwtDecode(headers.authorization) 
        if(token.error !== undefined) {
            return res.status(token.code).send({message: token.message})
        }
        body.user = token._id

        const newKanjiList = await KanjiList.create(body).catch(next)
        res.send(newKanjiList)
    }

    /**
     * Reads from database and retrieves a kanjilist
     * @param {*} params.id - the id of the kanjilist we want to get as a response
     * @param {*} res - the kanjilist with the given id
     */
    async get({params}, res, next) {
        const foundKanjiList = await KanjiList.findById(params.id).catch(next)
        res.send(foundKanjiList)
    }

    /**
     * Reads all kanjilists from database
     * @param {*} res - all kanjilists in database
     */
    async getAll(req, res, next) {
        const foundKanjiLists = await KanjiList.find().catch(next)
        res.send(foundKanjiLists)
    }

    /**
     * Updates a kanjilist
     * @param {*} params.id - the id of the kanjilist we want to update
     * @param {*} res - the response we give back after the kanjilist is updated
     */
    async edit({ body, params }, res, next) {
        await KanjiList.findByIdAndUpdate({ _id: params.id }, body).catch(next)
        res.send(await KanjiList.findById(params.id))
    }
    /**
     * 
     * @param {*} params.id - the id of the kanjilist we want to delete 
     * @param {*} res 
     */
    async delete({params }, res, next) {
        const removedKanjiList = await KanjiList.findByIdAndDelete(params.id).catch(next)
        res.send({message: 'deleted', object: removedKanjiList})
    }

    /**
     * @param {*} params.id - the id of the user we want to get kanjilists from
     */
    async getByUserId({params}, res, next) {
        const foundKanjiLists = await KanjiList.find({user: params.id}).catch(next)
        res.send(foundKanjiLists)
    }
}

module.exports = new GuideController()