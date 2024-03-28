const mongoose = require('mongoose')

const animeListItemSchema = new mongoose.Schema({
    animeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Anime',
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now,
        required: true
    }
}, { _id : false })

const animeListSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    favorites: [animeListItemSchema],
    toWatch: [animeListItemSchema],
    watched: [animeListItemSchema],
    abandoned: [animeListItemSchema]
})

module.exports = mongoose.model('AnimeList', animeListSchema)
