const express = require('express')
const app = express()
const kanjiListRoutes = require('./router/kanjilist.routes')
const GuideRoutes = require('./router/guide.routes')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise
if (process.env.NODE_ENV === 'dev') {
    mongoose.connect('mongodb://kanji_mongo/uber')
    console.log('Connected to docker database')  

} else if (process.env.NODE_ENV === 'prod') {
    const connectionString = process.env.DATABASE_CONNECTION
    mongoose.connect(connectionString)
    console.log('Connected to production database')
}

app.use(bodyParser.json())
kanjiListRoutes(app)
GuideRoutes(app)

app.use(async (err, req, res, next) => {
    res.status(422).send({ error: err.message })
})
module.exports = app