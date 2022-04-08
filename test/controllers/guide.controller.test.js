/* eslint-disable no-undef */
const assert = require('assert')
const request = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')
const guide = mongoose.model('guide')

describe('guide controller', () => {
    const preGuide =
    {
        'title': 'my new guide',
        'tags': ['new', 'test'],
        'content': '' +
            'I spent the first year of my Japanese studies lackadaisically studying kanji the way that everyone told me to study kanji: write each character a zillion times until it sticks in your brain. And, yeah, that was a huge disaster. So, after a year of studying, I knew a pretty solid smattering of Japanese, but I only knew about 500 kanji, despite having studied the kanji a lot.' +
            '' +
            'You might be thinking that 500 kanji is a pretty solid amount, but with kanji it’s kind of an all-or-nothing deal. Either you know them or you don’t. Knowing only the most common kanji is certainly better than nothing, but if you can’t read all the common-use characters, you’re still illiterate. And being illiterate sucks.' +
            '' +
            '";',
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
    it('posts to /api/guide and creates a new guide', async () => {
        const oldCount = await guide.count()
        await request(app).post('/api/guide')
            .set('Authorization', `Bearer ${token}`)
            .send(preGuide)

        const newCount = await guide.count()
        assert(newCount === oldCount + 1)
    })

    // CREATE
    it('posts to /api/guide and creates a new guide but fails because our title is too short', async () => {
        let wrongGuide = { ...preGuide, title: '0' }
        const oldCount = await guide.count()
        await request(app).post('/api/guide')
            .set('Authorization', `Bearer ${token}`)
            .send(wrongGuide)

        const newCount = await guide.count()
        assert(newCount !== oldCount + 1)
    })

    // CREATE
    it('posts to /api/guide and creates a new guide but fails because our title is null', async () => {
        let wrongGuide = { ...preGuide, title: null }
        const oldCount = await guide.count()
        await request(app).post('/api/guide')
            .set('Authorization', `Bearer ${token}`)
            .send(wrongGuide)

        const newCount = await guide.count()
        assert(newCount !== oldCount + 1)
    })

    // CREATE
    it('posts to /api/guide and fails to create a new guide due to a the content being < 250 characters', async () => {
        let wrongGuide = { ...preGuide, content: 'not 250 chracters long' }
        const oldCount = await guide.count()
        await request(app).post('/api/guide')
            .set('Authorization', `Bearer ${token}`)
            .send(wrongGuide)

        const newCount = await guide.count()
        assert(newCount !== oldCount + 1)
    })

    // CREATE
    it('posts to /api/guide and fails to create a new guide due to missing a title', async () => {
        let wrongGuide = { ...preGuide, title: undefined }
        const oldCount = await guide.count()
        await request(app).post('/api/guide')
            .set('Authorization', `Bearer ${token}`)
            .send(wrongGuide)

        const newCount = await guide.count()
        assert(newCount !== oldCount + 1)
    })

    // CREATE
    it('posts to /api/guide and fails to create a new guide due to tags being empty', async () => {
        let wrongGuide = { ...preGuide, tags: [] }
        const oldCount = await guide.count()
        await request(app).post('/api/guide')
            .set('Authorization', `Bearer ${token}`)
            .send(wrongGuide)

        const newCount = await guide.count()
        assert(newCount !== oldCount + 1)
    })

    // READ
    it('gets a guide from /api/guide/:id', async () => {
        const newGuide = new guide({ ...preGuide, user: userId })
        await newGuide.save()
        const foundGuide = await request(app).get(`/api/guide/${newGuide._id}`)
        assert(foundGuide.body._id.toString() === newGuide._id.toString())
    })

    // READ
    it('gets a guide from /api/guide/:id but fails since it is not a mongo ID', async () => {
        const newGuide = new guide({ ...preGuide, user: userId })
        await newGuide.save()
        const response = await request(app).get(`/api/guide/${newGuide._id}Xef`)
        assert(response.statusCode === 400)
    })

    // READ
    it('gets all guide from api/guide', async () => {
        const guideCount = 10
        for (let i = 0; i < guideCount; i++) {
            const newGuide = new guide({ ...preGuide, user: userId })
            await newGuide.save()
        }
        const foundGuide = await request(app).get('/api/guide')
        assert(foundGuide.body.length === guideCount)
    })

    // UPDATE 
    it('edits a guide from /api/guide/:id', async () => {
        const newguide = new guide({ ...preGuide, user: userId })
        await newguide.save()

        await request(app).put(`/api/guide/${newguide._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'new Name here' })

        const foundguide = await guide.findOne({ email: preGuide.email })
        assert(foundguide.title === 'new Name here')
    })

    // UPDATE 
    it('edits a guide from /api/guide/:id but fails because new name is too short', async () => {
        const newguide = new guide({ ...preGuide, user: userId })
        await newguide.save()

        const response = await request(app).put(`/api/guide/${newguide._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'short' })

        const foundguide = await guide.findOne({ email: preGuide.email })
        assert(foundguide.title !== 'short')
        assert(response.statusCode === 400)
    })

    // UPDATE 
    it('edits a guide from /api/guide/:id but fails because new content is too short', async () => {
        const newguide = new guide({ ...preGuide, user: userId })
        await newguide.save()

        const response = await request(app).put(`/api/guide/${newguide._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'way too shortshort' })

        const foundguide = await guide.findOne({ email: preGuide.email })
        assert(foundguide.content !== 'way too shortshort')
        assert(response.statusCode === 400)
    })

    // UPDATE 
    it('edits a guide from /api/guide/:id but updates nothing since a undefined value has been used', async () => {
        const newguide = new guide({ ...preGuide, user: userId })
        const oldName = newguide.title
        await newguide.save()

        await request(app).put(`/api/guide/${newguide._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: undefined })

        const foundguide = await guide.findOne({ email: preGuide.email })
        assert(oldName === foundguide.title)
    })

    // UPDATE 
    it('edits a guide from /api/guide/:id but fails because it does not exist', async () => {
        // we do not save this guide to the database!
        const newguide = new guide({ ...preGuide, user: userId })
        const response = await request(app).put(`/api/guide/${newguide._id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'the title of an unexisting guide' })
        // when we pass the auth middleware it can still check if its the owner 
        // and because it's not we check for a 401 (unathenticated)
        assert(response.statusCode === 401)
    })

    // DELETE
    it('removes a guide from /api/guide/:id', async () => {
        const newguide = new guide({ ...preGuide, user: userId })
        await newguide.save()

        await request(app).delete(`/api/guide/${newguide._id}`)
            .set('Authorization', `Bearer ${token}`)

        const foundguide = await guide.findOne({ email: preGuide.email })
        assert(foundguide === null)
    })
})