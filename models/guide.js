const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GuideSchema = new Schema({
    title: {
        type: String,
        required: [true, 'guide requires a title.'],
        validate: [validateTitle, 'the title must be at least 10 characters']
    },
    content: {
        type: String,
        required: [true, 'guide requires content'],
        validate: [validateContent, 'The content of the guide must at least contain 250 characters']
    },
    tags: {
        type: [String],
        required: [true, 'guide requires tags'],
        validate: [validateTags, 'list requires at least 1 tag'],
    },
    kanjilist: {
        type: Schema.Types.ObjectId,
        ref: 'kanjilist',
        autopopulate: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'guide needs a user'],
        autopopulate: true
    }

}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

GuideSchema.plugin(require('mongoose-autopopulate'))

GuideSchema.virtual('creationDate').get(function () {
    return new Date()
})

function validateTags(val) {
    return val.length >= 1
}

function validateTitle(val) {
    return val.length >= 10
}

function validateContent(val) {
    return val.length >= 250
}


const guide = mongoose.model('guide', GuideSchema)
module.exports = guide