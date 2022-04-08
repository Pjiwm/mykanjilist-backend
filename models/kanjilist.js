const mongoose = require('mongoose')
const Schema = mongoose.Schema

const KanjiListSchema = new Schema({
    name: {
        type: String,
        required: [true, 'list requires a name.'],
        validate: [validateName, 'the name must be at least 3 characters']
    },
    description: {
        type: String,
        required: [true, 'list requires a description.'],
        validate: [validateDescription, 'the description must be at least 20 characters']
    },
    kanji: {
        type: [String],
        required: [true, 'list requires kanji characters'],
        validate: [validateKanji, 'list requires at least 3 kanji characters'],
    },
    tags: {
        type: [String],
        required: [true, 'list requires tags'],
        validate: [validateTags, 'list requires at least 1 tag']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'kanjilist needs a user'],
        autopopulate: false
    }

}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

KanjiListSchema.plugin(require('mongoose-autopopulate'))

KanjiListSchema.virtual('creationDate').get(function () {
    return new Date()
})

function validateKanji(val) {
    return val.length >= 3
}

function validateTags(val) {
    return val.length >= 1
}

function validateName(val) {
    return val.length >= 3
}

function validateDescription(val) {
    return val.length >= 20
}

KanjiListSchema.pre('findOneAndUpdate', function (next) {
    this.options.runValidators = true
    next()
})

const kanjilist = mongoose.model('kanjilist', KanjiListSchema)
module.exports = kanjilist