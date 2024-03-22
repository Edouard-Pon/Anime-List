const express = require('express')
const router = express.Router()
const Anime = require('../models/anime')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']


// All Anime's Route
router.get('/', async (req, res) => {
    let query = Anime.find()
    try {
        const animes = await query.sort({ createdAt: 'desc' }).exec()
        res.json({
            animes: animes,
            searchOptions: req.body
        })
    } catch {
        res.status(500).json({ message: 'An error occurred while retrieving the data.' })
    }
})

//Search Anime's Route
router.post('/search', async (req, res) => {
    let query = Anime.find()
    if (req.body.title != null && req.body.title !== '') {
        query = query.regex('title', new RegExp(req.body.title, 'i'))
    }
    if (req.body.publishedBefore != null && req.body.publishedBefore !== '') {
        query = query.lte('publishDate', req.body.publishedBefore)
    }
    if (req.body.publishedAfter != null && req.body.publishedAfter !== '') {
        query = query.gte('publishDate', req.body.publishedAfter)
    }
    try {
        const animes = await query.sort({ createdAt: 'desc' }).exec()
        res.json({
            animes: animes,
            searchOptions: req.body
        })
    } catch {
        res.status(500).json({ message: 'An error occurred while retrieving the data.' })
    }
})

// New Anime Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Anime())
})

// Create Anime Route
router.post('/create', async (req, res) => {
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
    try {
        saveCover(anime, req.body.cover)
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

// Update Anime Route TODO - Test and fix
router.put('/:id', async (req, res) => {
    let anime
    try {
        console.log(req.body)
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
        res.json({ message: 'Anime updated successfully', anime: anime })
    } catch (e) {
        if (anime != null) {
            res.status(400).json({ message: 'Error updating Anime' })
        } else {
            res.status(404).json({ message: 'Anime not found' })
        }
    }
})

// Delete Anime Page
router.delete('/:id', async (req, res) => {
    let anime
    try {
        anime = await Anime.findById(req.params.id)
        await anime.remove()
        res.json({ message: 'Anime successfully deleted' })
    } catch {
        if (anime != null) {
            res.status(400).json({ message: 'Could not remove Anime', anime: anime })
        } else {
            res.status(404).json({ message: 'Anime not found' })
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
