const jwt = require('jsonwebtoken')
const practiceresource = require('../models/practiceresource')
const KanjiList = require('../models/kanjilist')
const PracticeResource = require('../models/practiceresource')
const Guide = require('../models/guide')


module.exports = async function (req, res, next) {
    let isSignedIn = false
    try {
        const token = req.headers.authorization.split(" ")[1]
        const secret = process.env.JWT_SECRET
        jwt.verify(token, secret)
        req.user = jwt.decode(token)
        isSignedIn = true
        console.log('try')
        // check ownership
        if (req.method === "DELETE" || req.method === "PUT") {
            const model = req.url.split("/")[2]
            switch (model) {
                case "kanjilist":
                    const kl = await KanjiList.findById(req.params.id).catch()
                    if (JSON.stringify(req.user.id) === JSON.stringify(kl.user._id)) {
                        return next()
                    }
                    break
                case "practiceresource":
                    const pr = await PracticeResource.findById(req.params.id).catch()
                    if (JSON.stringify(req.user.id) === JSON.stringify(pr.user._id)) {
                        return next()
                    }
                    break
                case "guide":
                    const guide = await Guide.findById(req.params.id).catch()
                    if (JSON.stringify(req.user.id) === JSON.stringify(guide.user._id)) {
                        return next()
                    }
                    break

            }
            return res.status(401).send({
                code: 401,
                message: "Unauthorized",
                message: "You are not the owner of this item"
            })
        }

        next()
    } catch (e) {
        let message = "you are not signed in"
        if (isSignedIn) {
            message = "This item is not accessible"
        }
        return res.status(401).send({
            code: 401,
            error: "Unauthorized ",
            message: message
        })
    }
}