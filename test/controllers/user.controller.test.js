/* eslint-disable no-undef */
const assert = require('assert')
const request = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')
const kanjilist = mongoose.model('kanjilist')

describe('Kanjilist controller', () => {

    let userReq
    beforeEach(async () => {
        userReq = await request(app).post('/api/register').send({
            userName: 'tester',
            password: 'tester123',
            email: 'testman@test.com'
        })
    })

    // LOGIN
    it('posts to /api/login and gives valid login information and a token', async () => {
        const foundUser = await request(app).post('/api/login').send({
            email: userReq.body.email,
            password: 'tester123'
        })
        assert(foundUser.body.email === userReq.body.email)
        assert(foundUser.body.userName === userReq.body.userName)
    })

    // CREATE - NOT SIGNED IN
    it('posts to /api/kanjilist and fails to create a new kanjilist due to not being logged in', async () => {
        let list = {
            name: 'list',
            kanji: ['漢', '漢', '漢'],
            tags: ['tag1', 'tag2', 'tag3'],
            description: 'description'
        }

        const req = await request(app).post('/api/kanjilist').send(list)
        assert(req.body.code === 401)
    })

    // UPDATE - WRONG USER
    it('puts to /api/kanjilist/:id and fails to update a new kanjilist due to being the wrong user', async () => {
        let list = {
            name: 'list',
            kanji: ['漢', '漢', '漢'],
            tags: ['tag1', 'tag2', 'tag3'],
            description: 'description of kanjilist'
        }

        const newKanjiList = new kanjilist({ ...list, user: userReq.body._id })
        await newKanjiList.save()

        wrongUserReq = await request(app).post('/api/register').send({
            userName: 'tester2',
            password: 'tester1234',
            email: 'testwrongMan@test.com'
        })

        const req = await request(app).put(`/api/kanjilist/${newKanjiList._id}`)
            .set('Authorization', `Bearer ${wrongUserReq.body.token}`)
            .send({ name: 'new Name' })
        assert(req.body.code === 401)

    })

    // REGISTER
    it('posts a user from /api/register/', async () => {
        const doubleTester = await request(app).post('/api/register').send({
            userName: 'tester',
            password: 'tester123',
            email: 'testman@test.com'
        })

        const newTester = await request(app).post('/api/register').send({
            userName: 'testerNEW',
            password: 'tester123',
            email: 'testerNEW@test.com'
        })

        assert(newTester.body.message === 'Login Success')
        assert(doubleTester.body.message === 'Email already in use')
    })
})