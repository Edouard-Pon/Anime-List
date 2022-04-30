const express = require('express')
const router = express.Router()
const Anime = require('../models/anime')
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
        const animes = await query.sort({ createdAt: 'desc' }).exec()
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
        description: req.body.description,
        viewStatus: req.body.viewStatus
    })
    saveCover(anime, req.body.cover)

    try {
        const newAnime = await anime.save()
        res.redirect(`anime/${newAnime.id}`)
    } catch {
        renderNewPage(res, anime, true)
    }
})

// Show Anime Route
router.get('/:id', async (req, res) => {
    try {
        const anime = await Anime.findById(req.params.id).exec()
        res.render('animes/show', { anime: anime })
    } catch {
        res.redirect('/')
    }
})

// Edit Anime Route
router.get('/:id/edit', async (req, res) => {
    try {
        const anime = await Anime.findById(req.params.id)
        renderEditPage(res, anime)
    } catch {
        res.redirect('/')
    }
})

// Update Anime Route
router.put('/:id', async (req, res) => {
    let anime

    try {
        anime = await Anime.findById(req.params.id)
        anime.title = req.body.title
        anime.episodesCount = req.body.episodesCount
        anime.status = req.body.status
        anime.publishDate = new Date(req.body.publishDate)
        anime.createdAt = new Date(req.body.createdAt)
        anime.externalLink = req.body.externalLink
        anime.description = req.body.description
        anime.viewStatus = req.body.viewStatus
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(anime, req.body.cover)
        }
        await anime.save()
        res.redirect(`/anime/${anime.id}`)
    } catch {
        if (anime != null) {
            renderEditPage(res, anime, true)
        } else {
            res.redirect('/')
        }
    }
})

// Delete Anime Page
router.delete('/:id', async (req, res) => {
    let anime
    try {
        anime = await Anime.findById(req.params.id)
        await anime.remove()
        res.redirect('/anime')
    } catch {
        if (anime != null) {
            res.render('animes/show', {
                anime: anime,
                errorMessage: 'Could not remove Anime'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, anime, hasError = false) {
    renderFormPage(res, anime, 'new', hasError)
}

async function renderEditPage(res, anime, hasError = false) {
    renderFormPage(res, anime, 'edit', hasError)
}

async function renderFormPage(res, anime, form, hasError = false) {
    try {
        const params = {
            anime: anime
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Anime'
            } else {
                params.errorMessage = 'Error Creating Anime'
            }
        }
        res.render(`animes/${form}`, params)
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
