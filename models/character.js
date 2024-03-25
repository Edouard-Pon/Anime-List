const mongoose = require('mongoose')
const Anime = require('./anime')

const characterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
    },
    description: {
        type: String
    },
    image: {
        type: Buffer,
        required: true
    },
    imageType: {
        type: String,
        required: true
    },
    anime: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Anime'
    },
    uploadDate: {
        type: Date,
        required: true,
        default: Date.now
    }
})

characterSchema.virtual('imagePath').get(function () {
    if (this.image != null && this.imageType != null) {
        return `data:${this.imageType};charset=utf-8;base64,${this.image.toString('base64')}`
    }
})

module.exports = mongoose.model('Character', characterSchema)
