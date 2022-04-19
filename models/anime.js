const mongoose = require('mongoose')

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
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    character: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Character'
    },
})

animeSchema.virtual('coverImagePath').get(function () {
    if (this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

module.exports = mongoose.model('Anime', animeSchema)