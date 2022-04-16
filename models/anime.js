const mongoose = require('mongoose')
const path = require('path')

const coverImageBasePath = 'uploads/animeCovers'

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
        type: String,
        required: true
    },
    externalLink: {
        type: String
    },
    coverImageName: {
        type: String,
        required: true
    },
    character: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Character'
    },
})

animeSchema.virtual('coverImagePath').get(function () {
    if (this.coverImageName != null) {
        return path.join('/', coverImageBasePath, this.coverImageName)
    }
})

module.exports = mongoose.model('Anime', animeSchema)
module.exports.coverImageBasePath = coverImageBasePath
