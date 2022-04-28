const mongoose = require('mongoose')
const Character = require('./character')

const animeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    episodesCount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    publishDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
    },
    source: {
        type: String
    },
    externalLink: {
        type: String
    },
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    viewStatus: {
        type: String,
    }
})

animeSchema.pre('remove', function (next) {
    Character.find({ anime: this.id }, (err, characters) => {
        if (err) {
            next(err)
        } else if (characters.length > 0) {
            next(new Error('This anime is pinned to characters'))
        } else {
            next()
        }
    })
})

animeSchema.virtual('coverImagePath').get(function () {
    if (this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Anime', animeSchema)
