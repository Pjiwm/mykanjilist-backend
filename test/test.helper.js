/* eslint-disable no-undef */
const mongoose = require('mongoose')
const neo4j = require('../neo')

before(async () => {
    const connectionString = process.env.DATABASE_CONNECTION
    await mongoose.connect(`${connectionString}/mykanjilist_test`)
    neo4j.connect('neo4j')
})

beforeEach(async () => {
    const { kanjilists } = mongoose.connection.collections
    const { users } = mongoose.connection.collections
    const { guides } = mongoose.connection.collections
    const { practiceresources } = mongoose.connection.collections
    await kanjilists.drop().catch(() => {
        // console.log('Database is still empty!')
    })
    await users.drop().catch(() => {
        // console.log('Database is still empty!')
    })
    await guides.drop().catch(() => {
        // console.log('Database is still empty!')
    })
    await practiceresources.drop().catch(() => {
        // console.log('Database is still empty!')
    })
    const session = neo4j.session()
    await session.run(neo4j.emptyDB)
})
