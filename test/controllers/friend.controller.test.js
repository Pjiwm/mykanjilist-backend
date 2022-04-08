/* eslint-disable no-undef */
const assert = require('assert')
const request = require('supertest')
const app = require('../../app')
// const mongoose = require('mongoose')
// const guide = mongoose.model('guide')
const neo = require('../../neo')

describe('friend controller', () => {
    let userToken, userId, friendToken, friendId
    beforeEach(async () => {
        const user = await request(app).post('/api/register').send({
            userName: 'tester',
            password: 'tester123',
            email: 'testman@test.com'
        })
        userToken = user.body.token
        userId = user.body._id

        const friend = await request(app).post('/api/register').send({
            userName: 'tester2',
            password: 'tester123',
            email: 'testman2@test.com'
        })
        friendToken = friend.body.token
        friendId = friend.body._id
    })

    // CREATE
    it('posts to /api/friend and creates a new friend request,' +
        'the requested friend should have one friend request with the corresponding id', async () => {
        await request(app).post('/api/friend')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ friend: friendId })

        const session = neo.session()
        const neoresult = await session.run(neo.getRequests, { user1Id: friendId })
        const items = neoresult.records[0].get('userIds')
        assert(items[0] === userId)
    })

    // CREATE
    it('posts to /api/friend and creates a new friend request with an invalid ID and fails', async () => {
        const response = await request(app).post('/api/friend')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ friend: '007' })
        assert(response.status === 400)
    })

    // CREATE
    it ('posts to /api/friend/:id to accept a friend request', async () => {
        const session = neo.session()
        await session.run(neo.makeRequest, { user1Id: userId, user2Id: friendId })
        await request(app).post(`/api/friend/${userId}`)
            .set('Authorization', `Bearer ${friendToken}`)
            .send({ accept: true })
        // if we have them as a friend it should remove the request
        let neoresult = await session.run(neo.getRequests, { user1Id: friendId })
        const requests = neoresult.records[0].get('userIds')
        // the user should only appear in the friend list now
        neoresult = await session.run(neo.getFriends, { id: friendId })
        let friends = neoresult.records[0].get('userIds')

        assert(requests.length === 0)
        assert(friends[0] === userId)
        assert(friends.length === 1)

    })

    // CREATE
    it('posts to /api/friend/:id to denies a friend request', async () => {
        const session = neo.session()
        await session.run(neo.makeRequest, { user1Id: userId, user2Id: friendId })
        await request(app).post(`/api/friend/${userId}`)
            .set('Authorization', `Bearer ${friendToken}`)
            .send({ accept: false })
        // if we have deny the request it should be removed
        let neoresult = await session.run(neo.getRequests, { user1Id: friendId })
        const requests = neoresult.records[0].get('userIds')
        // the user shouldn't appear in the friend list either
        neoresult = await session.run(neo.getFriends, { id: friendId })
        let friends = neoresult.records[0].get('userIds')
    
        assert(requests.length === 0)
        assert(friends.length === 0)
    
    })

    // READ
    it('gets the friendrequests from /api/friend/requests', async () => {
        const session = neo.session()
        await session.run(neo.makeRequest, { user1Id: userId, user2Id: friendId })
        const response = await request(app).get('/api/friend/requests')
            .set('Authorization', `Bearer ${friendToken}`)

        assert(response.body.length === 1)
        assert(response.body[0]._id === userId)

    })
    // DELETE
    it('removes an existing friend from /api/friend', async () => {
        const session = neo.session()
        await session.run(neo.makeRequest, { user1Id: userId, user2Id: friendId })
        await session.run(neo.acceptRequest, { user1Id: friendId, user2Id: userId })
        let neoresult = await session.run(neo.getFriends, { id: userId })

        const beforeFriendCount =  neoresult.records[0].get('userIds').length

        await request(app).delete('/api/friend')
            .set('Authorization', `Bearer ${userToken}`)
            .send({friend: friendId})

        neoresult = await session.run(neo.getFriends, {id: userId})

        const afterFriendCount = neoresult.records[0].get('userIds').length

        assert(beforeFriendCount -1 === afterFriendCount)
        assert(beforeFriendCount > afterFriendCount)
    })
})