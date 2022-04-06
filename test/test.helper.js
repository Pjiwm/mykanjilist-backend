const mongoose = require('mongoose')

before(async () => {
    const connectionString = process.env.DATABASE_CONNECTION
    await mongoose.connect(`${connectionString}/mykanjilist_test`)
})

beforeEach(async () => {
    const { kanjilists } = mongoose.connection.collections
    const { users } = mongoose.connection.collections
    const { guides } = mongoose.connection.collections
    const { practiceresources } = mongoose.connection.collections
    await kanjilists.drop().catch(() => {
        console.log('Database is still empty!')
    })
    await users.drop().catch(() => {
        console.log('Database is still empty!')
    })
    await guides.drop().catch(() => {
        console.log('Database is still empty!')
    })
    await practiceresources.drop().catch(() => {
        console.log('Database is still empty!')
    })
})
