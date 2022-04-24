const express = require('express')
const router = express.Router()
const Anime = require('../models/anime')

router.get('/', async (req, res) => {
    let animes
    try {
        animes = await Anime.find().sort({ createdAt: 'desc' }).exec()
    } catch {
        animes = []
    }
    res.render('index', { animes: animes })
})

module.exports = router
