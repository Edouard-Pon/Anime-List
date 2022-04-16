const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Anime = require('../models/anime')
const uploadPath = path.join('public', Anime.coverImageBasePath)
const Character = require('../models/character')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})


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
router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const anime = new Anime({
        title: req.body.title,
        episodesCount: req.body.episodesCount,
        status: req.body.status,
        publishDate: new Date(req.body.publishDate),
        createdAt: new Date(req.body.createdAt),
        source: req.body.source,
        externalLink: req.body.externalLink,
        coverImageName: fileName,
        character: req.body.character,
        description: req.body.description
    })

    try {
        const newAnime = await anime.save()
        // res.redirect(`anime/${newAnime.id}`)
        res.redirect(`anime`)
    } catch {
        if (anime.coverImageName != null) {
            removeAnimeCover(anime.coverImageName)
        }
        renderNewPage(res, anime, true)
    }
})

function removeAnimeCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), (err) => {
        if (err) console.error(err)
    })
}

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

module.exports = router
