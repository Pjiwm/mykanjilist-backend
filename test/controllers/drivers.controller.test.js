const assert = require('assert')
const request = require('supertest')
const app = require('../../app')
const mongoose = require('mongoose')
const driver = mongoose.model('driver')

describe('Drivers controller', () => {
    it('posts to /api/drivers and creates a new driver', async () => {
        const oldCount = await driver.count()
        await request(app).post('/api/drivers').send({ email: 'test@test.com' })
        const newCount = await driver.count()
        assert(newCount === oldCount + 1)
    })

    it('edits a driver from /api/driver/:id', async () => {
        const newDriver = new driver({ email: 't@t.com', driving: false })
        await newDriver.save()
        await request(app).put(`/api/drivers/${newDriver._id}`).send({ driving: true })
        const foundDriver = await driver.findOne({ email: 't@t.com' })
        assert(foundDriver.driving === true)
    })

    it('removes a driver from /api/driver/:id', async () => {
        const newDriver = new driver({ email: 'test@test.com' })
        await newDriver.save()
        await request(app).delete(`/api/drivers/${newDriver._id}`)
        const foundDriver = await driver.findOne({ email: 'test@test.com' })
        assert(foundDriver === null)
    })

    it('gets a driver from /api/driver/:id', async () => {
        const newDriver = new driver({ email: 'new@test.com' })
        await newDriver.save()
        const foundDriver = await request(app).get(`/api/drivers/${newDriver._id}`)
        assert(foundDriver.body._id.toString() === newDriver._id.toString())
    })

    it('gets all driversf from api/driver', async () => {
        const driverCount = 10
        for (let i = 0; i < driverCount; i++) {
            const newDriver = new driver({ email: 'new@test.com' })
            await newDriver.save()
        }
        const foundDrivers = await request(app).get('/api/drivers')
        assert(foundDrivers.body.length === driverCount)

    })
})