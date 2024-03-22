const express = require('express')
const router = express.Router()
const Anime = require('../models/anime')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']


// Get all anime's /anime TODO - Add pagination
router.get('/', async (req, res) => {
    let query = Anime.find()
    try {
        let animes = await query.sort({ createdAt: 'desc' }).exec()
        animes = animes.map(anime => {
            const { coverImage, coverImageType, ...animeWithoutCoverImage } = anime._doc
            return { ...animeWithoutCoverImage, coverImagePath: anime.coverImagePath }
        })
        res.json({
            animes: animes,
        })
    } catch {
        res.status(500).json({ message: 'An error occurred while retrieving the data.' })
    }
})

// Get Anime by ID /anime/:id
router.get('/:id', async (req, res) => {
    try {
        let anime = await Anime.findById(req.params.id).exec()
        const { coverImage, coverImageType, ...animeWithoutCoverImage } = anime._doc
        anime = { ...animeWithoutCoverImage, coverImagePath: anime.coverImagePath }
        res.json(anime)
    } catch {
        res.status(500).json({ message: 'An error occurred while retrieving the data.' })
    }
})

// Search Anime's /anime/search
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
        let animes = await query.sort({ createdAt: 'desc' }).exec()
        animes = animes.map(anime => {
            const { coverImage, coverImageType, ...animeWithoutCoverImage } = anime._doc
            return { ...animeWithoutCoverImage, coverImagePath: anime.coverImagePath }
        })
        res.json({
            animes: animes,
            searchOptions: req.body
        })
    } catch {
        res.status(500).json({ message: 'An error occurred while retrieving the data.' })
    }
})

// Create Anime Route TODO - Create anime in database
// router.post('/create', async (req, res) => {
//     const anime = new Anime({
//         title: req.body.title,
//         episodesCount: req.body.episodesCount,
//         status: req.body.status,
//         publishDate: new Date(req.body.publishDate),
//         createdAt: new Date(req.body.createdAt),
//         source: req.body.source,
//         externalLink: req.body.externalLink,
//         description: req.body.description,
//         viewStatus: req.body.viewStatus
//     })
//     try {
//         saveCover(anime, req.body.cover)
//         const newAnime = await anime.save()
//         res.redirect(`anime/${newAnime.id}`)
//     } catch {
//         renderNewPage(res, anime, true)
//     }
// })

// Update Anime Route TODO - Test and fix - Update anime in database
// router.put('/:id', async (req, res) => {
//     let anime
//     try {
//         console.log(req.body)
//         anime = await Anime.findById(req.params.id)
//         anime.title = req.body.title
//         anime.episodesCount = req.body.episodesCount
//         anime.status = req.body.status
//         anime.publishDate = new Date(req.body.publishDate)
//         anime.createdAt = new Date(req.body.createdAt)
//         anime.externalLink = req.body.externalLink
//         anime.description = req.body.description
//         anime.viewStatus = req.body.viewStatus
//         if (req.body.cover != null && req.body.cover !== '') {
//             saveCover(anime, req.body.cover)
//         }
//         await anime.save()
//         res.json({ message: 'Anime updated successfully', anime: anime })
//     } catch (e) {
//         if (anime != null) {
//             res.status(400).json({ message: 'Error updating Anime' })
//         } else {
//             res.status(404).json({ message: 'Anime not found' })
//         }
//     }
// })

// Delete Anime Page TODO - Delete anime from database
// router.delete('/:id', async (req, res) => {
//     let anime
//     try {
//         anime = await Anime.findById(req.params.id)
//         await anime.remove()
//         res.json({ message: 'Anime successfully deleted' })
//     } catch {
//         if (anime != null) {
//             res.status(400).json({ message: 'Could not remove Anime', anime: anime })
//         } else {
//             res.status(404).json({ message: 'Anime not found' })
//         }
//     }
// })

function saveCover(anime, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        anime.coverImage = new Buffer.from(cover.data, 'base64')
        anime.coverImageType = cover.type
    }
}

module.exports = router
