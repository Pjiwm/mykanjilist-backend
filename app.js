const express = require('express')
const app = express()
const kanjiListRoutes = require('./router/kanjilist.routes')
const GuideRoutes = require('./router/guide.routes')
const PracticeResourceRoutes = require('./router/practiceresource.routes')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const errors = require('./errors')

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
PracticeResourceRoutes(app)

// errors
// catch all not found response
app.use('*', function(_, res) {
    res.status(404).end()
})

// error responses
app.use('*', function(err, req, res, next) {
    console.error(`${err.name}: ${err.message}`)
    // console.error(err)
    next(err)
})

app.use('*', errors.handlers)

app.use('*', function(err, req, res, next) {
    res.status(500).json({
        message: 'something really unexpected happened'
    })
})

app.use(async (err, req, res, next) => {
    res.status(422).send({ error: err.message })
})
module.exports = app