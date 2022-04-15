const express = require('express')
const router = express.Router()
const Anime = require('../models/anime')

// All Anime Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name =  new RegExp(req.query.name, 'i')
    }
    try {
        const anime =  await Anime.find(searchOptions)
        res.render('anime/index', {
            anime: anime,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Anime Route
router.get('/new',  (req, res) => {
    res.render('anime/new', { anime: new Anime() })
})

// Create Anime Route
router.post('/', async (req, res) => {
    const anime = new Anime({
        name: req.body.name
    })
    try {
        const newAnime = await anime.save()
        // res.redirected(`anime/${newAnime.id}`)
        res.redirect(`anime`)
    } catch {
        res.render('anime/new', {
            anime: anime,
            errorMessage: 'Error creating Anime'
        })
    }
})

module.exports = router
