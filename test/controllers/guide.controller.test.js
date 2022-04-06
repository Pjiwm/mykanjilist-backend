const assert = require('assert')
const request = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')
const guide = mongoose.model('guide')

describe('guide controller', () => {
    const preGuide =
    {
        "title": "my new guide",
        "tags": ["new", "test"],
        "content": "" +
            "I spent the first year of my Japanese studies lackadaisically studying kanji the way that everyone told me to study kanji: write each character a zillion times until it sticks in your brain. And, yeah, that was a huge disaster. So, after a year of studying, I knew a pretty solid smattering of Japanese, but I only knew about 500 kanji, despite having studied the kanji a lot." +
            "" +
            "You might be thinking that 500 kanji is a pretty solid amount, but with kanji it’s kind of an all-or-nothing deal. Either you know them or you don’t. Knowing only the most common kanji is certainly better than nothing, but if you can’t read all the common-use characters, you’re still illiterate. And being illiterate sucks." +
            "" +
            "\";",
    }
    let token, userId
    beforeEach(async () => {
        const user = await request(app).post('/api/register').send({
            userName: "tester",
            password: "tester123",
            email: "testman@test.com"
        })
        token = user.body.token
        userId = user.body._id
    })

    // CREATE
    it('posts to /api/guide and creates a new guide', async () => {
        const oldCount = await guide.count()
        await request(app).post('/api/guide')
            .set("Authorization", `Bearer ${token}`)
            .send(preGuide)

        const newCount = await guide.count()
        assert(newCount === oldCount + 1)
    })

    // CREATE
    it('posts to /api/guide and fails to create a new guide due to a the content being < 250 characters', async () => {
        let wrongGuide = { ...preGuide, content: "not 250 chracters long" }
        const oldCount = await guide.count()
        await request(app).post('/api/guide')
            .set("Authorization", `Bearer ${token}`)
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
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "new Name" })

        const foundguide = await guide.findOne({ email: preGuide.email })
        assert(foundguide.title === "new Name")
    })

    // DELETE
    it('removes a guide from /api/guide/:id', async () => {
        const newguide = new guide({ ...preGuide, user: userId })
        await newguide.save()

        await request(app).delete(`/api/guide/${newguide._id}`)
            .set("Authorization", `Bearer ${token}`)

        const foundguide = await guide.findOne({ email: preGuide.email })
        assert(foundguide === null)
    })
})