const mongoose = require('mongoose')
const Anime = require('./anime')

const characterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

characterSchema.pre('remove', function (next) {
    Anime.find({ character: this.id }, (err, animes) => {
        if (err) {
            next(err)
        } else if (animes.length > 0) {
            next(new Error('This character has anime still'))
        } else {
            next()
        }
    })
})

module.exports = mongoose.model('Character', characterSchema)
