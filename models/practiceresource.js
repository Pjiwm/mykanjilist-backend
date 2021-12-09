const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PracticeResourceSchema = new Schema({
    title: {
        type: String,
        required: [true, 'practice resource requires a title.'],
        validate: [validateTitle, 'the title must be at least 10 characters']
    },
    content: {
        type: String,
        required: [true, 'practice resource requires content'],
        validate: [validateContent, 'The content of the practice resource at least contain 50 characters']
    },
    requiredSkills: {
        type: [String],
        required: [true, 'practice resource requires a list of skills'],
        validate: [validateRequiredSkills, 'list requires at least 1 skill'],
    },
    estimatedReadingTime: {
        type: Number,
        required: [true, 'practice resource requires an estimated reading time'],
        validate: [validateReadingTime, 'The estimated reading time must be at least 1 minute']
    },
    kanjilist: {
        type: Schema.Types.ObjectId,
        ref: 'kanjilist',
        autopopulate: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'practice resource needs a user'],
        autopopulate: false
    }

}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

PracticeResourceSchema.plugin(require('mongoose-autopopulate'))


PracticeResourceSchema.virtual('creationDate').get(function () {
    return new Date()
})

function validateRequiredSkills(val) {
    return val.length >= 1
}

function validateTitle(val) {
    return val.length >= 10
}

function validateContent(val) {
    return val.length >= 50
}

function validateReadingTime(val) {
    return val >= 1
}


const practiceResource = mongoose.model('practiceresource', PracticeResourceSchema)
module.exports = practiceResource