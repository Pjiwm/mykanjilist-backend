const assert = require('assert')
const request = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')
const practiceResource = mongoose.model('practiceresource')

describe('practiceresource controller', () => {
    const preResource =
    {
        "estimatedReadingTime": 10,
        "title": "Sample title for testing",
        "content": "The content must be at least 50 characters long to work, therefore I'm typing this long sentence.",
        "requiredSkills": ["JLPT N5", "N5"],
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
    it('posts to /api/practiceresource and creates a new practice resource', async () => {
        const oldCount = await practiceResource.count()
        await request(app).post('/api/practiceresource')
            .set("Authorization", `Bearer ${token}`)
            .send(preResource)

        const newCount = await practiceResource.count()
        assert(newCount === oldCount + 1)
    })

    // CREATE
    it('posts to /api/practiceresource and fails to create a new resource due to reading time being lower than 1', async () => {
        let wrongResource = { ...preResource, estimatedReadingTime: 0 }
        const oldCount = await practiceResource.count()
        await request(app).post('/api/practiceresource')
            .set("Authorization", `Bearer ${token}`)
            .send(wrongResource)

        const newCount = await practiceResource.count()
        assert(newCount !== oldCount + 1)
    })

    // READ
    it('gets a practiceresource from /api/practiceresource/:id', async () => {
        const newResource = new practiceResource({ ...preResource, user: userId })
        await newResource.save()
        const foundResource = await request(app).get(`/api/practiceresource/${newResource._id}`)
        assert(foundResource.body._id.toString() === newResource._id.toString())
    })
    // READ
    it('gets all practiceresource from api/practiceresource', async () => {
        const resourceCount = 10
        for (let i = 0; i < resourceCount; i++) {
            const newResource = new practiceResource({ ...preResource, user: userId })
            await newResource.save()
        }
        const foundResource = await request(app).get('/api/practiceresource')
        assert(foundResource.body.length === resourceCount)
    })

    // UPDATE 
    it('edits a practiceresource from /api/practiceresource/:id', async () => {
        const newResource = new practiceResource({ ...preResource, user: userId })
        await newResource.save()

        await request(app).put(`/api/practiceresource/${newResource._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "new Name" })

        const foundResource = await practiceResource.findOne({ email: preResource.email })
        assert(foundResource.title === "new Name")
    })

    // DELETE
    it('removes a practiceresource from /api/practiceresource/:id', async () => {
        const newResource = new practiceResource({ ...preResource, user: userId })
        await newResource.save()

        await request(app).delete(`/api/practiceresource/${newResource._id}`)
            .set("Authorization", `Bearer ${token}`)

        const foundResource = await practiceResource.findOne({ email: preResource.email })
        assert(foundResource === null)
    })
})