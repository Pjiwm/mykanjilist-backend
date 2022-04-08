/* eslint-disable no-undef */
const assert = require('assert')
const request = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')
const kanjilist = mongoose.model('kanjilist')

describe('Kanjilist controller', () => {
    const preList =
    {
        'name': 'Test api',
        'description': 'testing the api with a test object in here!',
        'tags': ['test'],
        'kanji': ['価', '格', '目', '録'],
        'creationDate': '2021-12-08T14:52:35.607Z'
    }
    let token, userId
    beforeEach(async () => {
        const user = await request(app).post('/api/register').send({
            userName: 'tester',
            password: 'tester123',
            email: 'testman@test.com'
        })
        token = user.body.token
        userId = user.body._id
    })

    // CREATE
    it('posts to /api/kanjilist and creates a new kanjilist', async () => {
        const oldCount = await kanjilist.count()
        await request(app).post('/api/kanjilist')
            .set('Authorization', `Bearer ${token}`)
            .send(preList)

        const newCount = await kanjilist.count()
        assert(newCount === oldCount + 1)
    })

    // CREATE
    it('posts to /api/kanjilist and fails to create a new kanjilist due to lack of kanji', async () => {
        let wrongList = { ...preList, kanji: ['漢'] }
        const oldCount = await kanjilist.count()
        await request(app).post('/api/kanjilist')
            .set('Authorization', `Bearer ${token}`)
            .send(wrongList)

        const newCount = await kanjilist.count()
        assert(newCount !== oldCount + 1)
    })

    // CREATE
    it('posts to /api/kanjilist and fails to create a new kanjilist due to lack of tags', async () => {
        let wrongList = { ...preList, tags: [] }
        const oldCount = await kanjilist.count()
        await request(app).post('/api/kanjilist')
            .set('Authorization', `Bearer ${token}`)
            .send(wrongList)

        const newCount = await kanjilist.count()
        assert(newCount !== oldCount + 1)
    })

    // CREATE
    it('posts to /api/kanjilist and fails to create a new kanjilist due to description under 20 characters', async () => {
        let wrongList = { ...preList, description: '123' }
        const oldCount = await kanjilist.count()
        await request(app).post('/api/kanjilist')
            .set('Authorization', `Bearer ${token}`)
            .send(wrongList)

        const newCount = await kanjilist.count()
        assert(newCount !== oldCount + 1)
    })

    // CREATE
    it('posts to /api/kanjilist and fails to create a new kanjilist due to missing JSON', async () => {
        const oldCount = await kanjilist.count()
        await request(app).post('/api/kanjilist')
            .set('Authorization', `Bearer ${token}`)
            .send({})

        const newCount = await kanjilist.count()
        assert(newCount !== oldCount + 1)
    })

    // CREATE
    it('posts to /api/kanjilist and fails to create a new kanjilist due to passing nulls', async () => {
        const oldCount = await kanjilist.count()
        await request(app).post('/api/kanjilist')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: null, tags: null, kanji: preList.kanji, description: null, creationDate: null })

        const newCount = await kanjilist.count()
        assert(newCount !== oldCount + 1)
    })

    // READ
    it('gets a kanjilist from /api/kanjilist/:id', async () => {
        const newKanjiList = new kanjilist({ ...preList, user: userId })
        await newKanjiList.save()
        const foundKanjiList = await request(app).get(`/api/kanjilist/${newKanjiList._id}`)
        assert(foundKanjiList.body._id.toString() === newKanjiList._id.toString())
    })

    // READ
    it('gets a kanjilist from /api/kanjilist/:id but fails because it is not a valid parameter id', async () => {
        const newKanjiList = new kanjilist({ ...preList, user: userId })
        await newKanjiList.save()
        const response = await request(app).get(`/api/kanjilist/${newKanjiList._id}XXXX`)
        assert(response.statusCode === 400)
    })

    // READ
    it('gets all kanjilist from api/kanjilist', async () => {
        const kanjiListCount = 10
        for (let i = 0; i < kanjiListCount; i++) {
            const newKanjiList = new kanjilist({ ...preList, user: userId })
            await newKanjiList.save()
        }
        const foundKanjiList = await request(app).get('/api/kanjilist')
        assert(foundKanjiList.body.length === kanjiListCount)
    })

    // UPDATE 
    it('edits a kanjilist from /api/kanjilist/:id', async () => {
        const newKanjiList = new kanjilist({ ...preList, user: userId })
        await newKanjiList.save()

        await request(app).put(`/api/kanjilist/${newKanjiList._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'new Name' })

        const foundKanjiList = await kanjilist.findOne({ email: preList.email })
        assert(foundKanjiList.name === 'new Name')
    })

    // UPDATE 
    it('edits a kanjilist from /api/kanjilist/:id but fails because description is too short', async () => {
        const newKanjiList = new kanjilist({ ...preList, user: userId })
        await newKanjiList.save()

        const response = await request(app).put(`/api/kanjilist/${newKanjiList._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ description: 'short' })

        const foundKanjiList = await kanjilist.findOne({ email: preList.email })
        assert(foundKanjiList.name !== 'short')
        assert(response.statusCode === 400)
    })

    // UPDATE 
    it('edits a kanjilist from /api/kanjilist/:id but fails because lack of tags', async () => {
        const newKanjiList = new kanjilist({ ...preList, user: userId })
        await newKanjiList.save()

        const response = await request(app).put(`/api/kanjilist/${newKanjiList._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ tags: [] })

        const foundKanjiList = await kanjilist.findOne({ email: preList.email })
        assert(foundKanjiList.tags.length !== 0)
        assert(response.statusCode === 400)
    })

    // UPDATE 
    it('edits a kanjilist from /api/kanjilist/:id but fails because lack of kanji', async () => {
        const newKanjiList = new kanjilist({ ...preList, user: userId })
        await newKanjiList.save()

        const response = await request(app).put(`/api/kanjilist/${newKanjiList._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ kanji: ['価', '堤'] })

        const foundKanjiList = await kanjilist.findOne({ email: preList.email })
        assert(foundKanjiList.kanji.length !== 2)
        assert(response.statusCode === 400)
    })

    // UPDATE 
    it('edits a kanjilist from /api/kanjilist/:id but fails because name is too short', async () => {
        const newKanjiList = new kanjilist({ ...preList, user: userId })
        await newKanjiList.save()

        const response = await request(app).put(`/api/kanjilist/${newKanjiList._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'XX' })

        const foundKanjiList = await kanjilist.findOne({ email: preList.email })
        assert(foundKanjiList.name.length !== 2)
        assert(response.statusCode === 400)
    })

    // UPDATE 
    it('edits a kanjilist from /api/kanjilist/:id and will ignore the null value passed', async () => {
        const newKanjiList = new kanjilist({ ...preList, user: userId })
        await newKanjiList.save()

        const response = await request(app).put(`/api/kanjilist/${newKanjiList._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: null })
        const foundKanjiList = await kanjilist.findOne({ email: preList.email })
        assert(foundKanjiList.name === newKanjiList.name)
        assert(response.statusCode === 400)
    })

    // UPDATE 
    it('edits a kanjilist from /api/kanjilist/:id but fails  because it is not the owner', async () => {
        const newKanjiList = new kanjilist({ ...preList, user: userId })
        await newKanjiList.save()

        const response = await request(app).put(`/api/kanjilist/${newKanjiList._id}`)
            .set('Authorization', `Bearer ${token}Jeff`)
            .send({ name: 'new Name' })

        const foundKanjiList = await kanjilist.findOne({ email: preList.email })
        assert(foundKanjiList.name !== 'new Name')
        assert(response.statusCode === 401)
    })

    // DELETE
    it('removes a kanjilist from /api/kanjilist/:id', async () => {
        const newKanjiList = new kanjilist({ ...preList, user: userId })
        await newKanjiList.save()

        await request(app).delete(`/api/kanjilist/${newKanjiList._id}`)
            .set('Authorization', `Bearer ${token}`)

        const foundKanjiList = await kanjilist.findOne({ email: preList.email })
        assert(foundKanjiList === null)
    })

    // DELETE
    it('removes a kanjilist from /api/kanjilist/:id but fails because it is not the owner', async () => {
        const newKanjiList = new kanjilist({ ...preList, user: userId })
        await newKanjiList.save()

        const response = await request(app).delete(`/api/kanjilist/${newKanjiList._id}`)
            .set('Authorization', `Bearer ${token}FRAUD`)

        const foundKanjiList = await kanjilist.findOne({ email: preList.email })
        assert(foundKanjiList !== null)
        assert(response.statusCode === 401)
    })
})