const express = require('express')
const router = express.Router()
const Anime = require('../models/anime')
const Character = require('../models/character')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']


// All Anime's Route
router.get('/', async (req, res) => {
    let query = Anime.find()
    if (req.query.title != null && req.query.title !== '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore !== '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter !== '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const animes = await query.exec()
        res.render('animes/index', {
            animes: animes,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Anime Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Anime())
})

// Create Anime Route
router.post('/', async (req, res) => {
    const anime = new Anime({
        title: req.body.title,
        episodesCount: req.body.episodesCount,
        status: req.body.status,
        publishDate: new Date(req.body.publishDate),
        createdAt: new Date(req.body.createdAt),
        source: req.body.source,
        externalLink: req.body.externalLink,
        character: req.body.character,
        description: req.body.description
    })
    saveCover(anime, req.body.cover)

    try {
        const newAnime = await anime.save()
        // res.redirect(`anime/${newAnime.id}`)
        res.redirect(`anime`)
    } catch {
        renderNewPage(res, anime, true)
    }
})

async function renderNewPage(res, anime, hasError = false) {
    try {
        const characters = await Character.find({})
        const params = {
            characters: characters,
            anime: anime
        }
        if (hasError) params.errorMessage = 'Error Creating'
        res.render('animes/new', params)
    } catch {
        res.redirect('/anime')
    }
}

function saveCover(anime, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        anime.coverImage = new Buffer.from(cover.data, 'base64')
        anime.coverImageType = cover.type
    }
}

module.exports = router
