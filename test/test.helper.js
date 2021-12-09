const mongoose = require('mongoose')

before( async () => {
    await mongoose.connect('mongodb://kanji_mongo/mykanjilist_test')
})

beforeEach( async () => {
    const { kanjilist } = mongoose.connection.collections
    await kanjilist.drop().catch(() => {
        console.log('Database is still empty!')
    })
})


getJwt(async () => {
    
})