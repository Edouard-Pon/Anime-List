const mongoose = require('mongoose')

const characterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String
    },
    age: {
        type: String
    },
    image: {
        type: Buffer,
        required: true
    },
    description: {
        type: String
    },
    imageType: {
        type: String,
        required: true
    },
    anime: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Anime'
    }
})

characterSchema.virtual('imagePath').get(function () {
    if (this.image != null && this.imageType != null) {
        return `data:${this.imageType};charset=utf-8;base64,${this.image.toString('base64')}`
    }
})

module.exports = mongoose.model('Character', characterSchema)
