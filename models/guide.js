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
    requiredSkills: {
        type: [String],
        required: [true, 'guide requires a list of skills'],
        validate: [validateRequiredSkills, 'list requires at least 1 skill'],
    },

}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

GuideSchema.virtual('creationDate').get(function () {
    return new Date()
})

function validateRequiredSkills(val) {
    return val.length >= 1
}

function validateTags(val) {
    return val.length >= 1
}

function validateTitle(val) {
    return val.length >= 10
}

function validateContent(val) {
    return val.length >= 250
}


const kanjilist = mongoose.model('guide', GuideSchema)
module.exports = kanjilist