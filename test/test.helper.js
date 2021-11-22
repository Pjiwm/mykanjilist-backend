const mongoose = require('mongoose')

before( async () => {
    await mongoose.connect('mongodb://uber_mongo/uber_test')
})

beforeEach( async () => {
    const { drivers } = mongoose.connection.collections
    await drivers.drop().catch(() => {
        console.log('Database is still empty!')
    })
})