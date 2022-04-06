const User = require('../models/user')
const jwtDecode = require('../helpers/jwt.decode')
const neo = require('../neo')

class FriendController {
    /**
     * Creates a friend request to another user
     * @param {*} params.id - the id of the guide we want to get as a response
     * @param {*} res - the guide with the given id
     */
    async add({ body, headers }, res, next) {
        const token = await jwtDecode(headers.authorization)
        if (token.error !== undefined) {
            return res.status(token.code).send({ message: token.message })
        }

        const requestedFriend = await User.findOne({ _id: body.friend }).catch(next)
        if (requestedFriend === null) {
            res.status(400).send({ message: "user not specified" })
        }

        const session = neo.session()
        const neoresult = await session.run(neo.makeRequest, { user1Id: token._id, user2Id: requestedFriend.id })
        const friendship = neoresult.records[0].get('friendship')
        session.close()

        if (friendship[0].type == "FRIEND_REQUESTED") {
            return res.send({ message: "friend request sent" })
        }
        res.status(422).send({ message: "friend request failed" })

    }
    /**
     * Let's a user accept or decline a friend request they've received. 
     * @param {*} params - The parameter we'll use is the ID of the user who sent a friend request 
     * @param {*} res - The result wheter or not the friend request has succesfully been accepted
     * @param {*} body - The body property accept (bool) will define wheter we accept or deny the friend offer
     */
    async acceptOrDecline({ params, headers, body }, res, next) {
        const token = await jwtDecode(headers.authorization)
        if (token.error !== undefined) {
            return res.status(token.code).send({ message: token.message })
        }

        const session = neo.session()
        if (body.accept === true) {
            await session.run(neo.acceptRequest, { user1Id: token._id, user2Id: params.id }).catch(() => {
                return res.status(422).send({ message: "Something went wrong" })
            })
            session.close();
            return res.send({ message: "Friend added" })
        }

        if (body.accept === false) {
            await session.run(neo.ignoreRequest, { user1Id: result, user2Id: arams.id }).catch(() => {
                return res.status(422).send({ message: "Something went wrong" })
            })
        }

        res.status(400).send({ message: "the body property accept (bool) has not been specified" })
    }

    /**
     * get friends from a user
     * @param {*} res - the response in which we send all the users friends
     */
    async get({ headers }, res, next) {
        const token = await jwtDecode(headers.authorization)
        if (token.error !== undefined) {
            return res.status(token.code).send({ message: token.message })
        }

        const session = neo.session()
        const neoresult = await session.run(neo.getFriends, { id: token._id })
        let items = neoresult.records[0].get('userIds')
        session.close()
        const friends = await User.find({ _id: { $in: items } }).catch(next)
        friends.forEach(friend => {
            friend.password = undefined
        })
        res.send(friends)
    }
    /**
     * Gets all the friend requests from a user
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    async getRequests({headers}, res, next) {
        const token = await jwtDecode(headers.authorization)
        if (token.error !== undefined) {
            return res.status(token.code).send({ message: token.message })
        }
        const session = neo.session()
        const neoresult = await session.run(neo.getRequests, { user1Id: token._id })
        const items = neoresult.records[0].get('userIds')
        session.close()
        const friends = await User.find({ _id: { $in: items } })
        friends.forEach(friend => {
            friend.password = undefined
        })
        res.send(friends)
    }

    /**
     * Deletes a friend
     * @param {*} headers - The user who wants to remove a friend
     * @param {*} body - Friend to remove with friend property using friend's id
     */
    async delete({ headers, body }, res, next) {
        const token = await jwtDecode(headers.authorization)
        if (token.error !== undefined) {
            return res.status(token.code).send({ message: token.message })
        }
        const requestedFriend = await User.findOne({ _id: body.friend }).catch(next)
        if (requestedFriend === null) {
            res.status(400).send({ message: "user not specified" })
        }
        const session = neo.session()
        await session.run(neo.removeFriend, { user1Id: token._id, user2Id: requestedFriend.id })
        session.close()
        res.send({ message: "successfully removed friend" })
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
     * @param {*} params.id - the user id we get the guides from
     */
    async getByUserId({ params }, res, next) {
        const foundGuide = await Guide.find({ user: params.id }).catch(next)
        res.send(foundGuide)
    }
}

module.exports = new FriendController()