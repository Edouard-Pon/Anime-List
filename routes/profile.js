const express = require('express')
const router = express.Router()
const Anime = require('../models/anime')


// Profile Route
router.get('/', (req, res) => {
    res.render('profile/index')
})

// Profile Watching Route
router.get('/watching', async (req, res) => {
    let animes
    try {
        animes = await Anime.find({ viewStatus: 'Watching' }).sort({ createdAt: 'desc' }).exec()
    } catch {
        animes = []
    }
    res.render('profile/watching', { animes: animes })
})

// Profile Watched Route
router.get('/watched', async (req, res) => {
    let animes
    try {
        animes = await Anime.find({ viewStatus: 'Watched' }).sort({ createdAt: 'desc' }).exec()
    } catch {
        animes = []
    }
    res.render('profile/watched', { animes: animes })
})

// Profile To Watch Route
router.get('/to_watch', async (req, res) => {
    let animes
    try {
        animes = await Anime.find({ viewStatus: 'To Watch' }).sort({ createdAt: 'desc' }).exec()
    } catch {
        animes = []
    }
    res.render('profile/to_watch', { animes: animes })
})

// Profile Abandoned Route
router.get('/abandoned', async (req, res) => {
    let animes
    try {
        animes = await Anime.find({ viewStatus: 'Abandoned' }).sort({ createdAt: 'desc' }).exec()
    } catch {
        animes = []
    }
    res.render('profile/abandoned', { animes: animes })
})


module.exports = router
