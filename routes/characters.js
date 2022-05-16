const express = require('express')
const router = express.Router()
const Character = require('../models/character')
const Anime = require('../models/anime')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

// All Characters Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name =  new RegExp(req.query.name, 'i')
    }
    try {
        const characters =  await Character.find(searchOptions)
        res.render('characters/index', {
            characters: characters,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Character Route
router.get('/new', async (req, res) => {
    const animes = await Anime.find({})
    res.render('characters/new', { animes: animes, character: new Character() })
})

// Create Character Route
router.post('/', async (req, res) => {
    const character = new Character({
        name: req.body.name,
        surname: req.body.surname,
        age: req.body.age,
        anime: req.body.anime,
        description: req.body.description
    })
    try {
        saveImage(character, req.body.image)
        const newCharacter = await character.save()
        res.redirect(`characters/${newCharacter.id}`)
    } catch {
        const animes = await Anime.find({})
        res.render('characters/new', {
            character: character,
            animes: animes,
            errorMessage: 'Error creating Character'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const character = await Character.findById(req.params.id)
        const animes = await  Anime.find({ _id: character.anime }).exec()
        res.render('characters/show', {
            character: character,
            animes: animes
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const character = await Character.findById(req.params.id)
        const animes = await Anime.find({})
        res.render('characters/edit', { animes: animes, character: character })
    } catch {
        res.redirect('/characters')
    }
})

router.put('/:id', async (req, res) => {
    let character
    const animes = await Anime.find({})
    try {
        character = await Character.findById(req.params.id)
        character.name = req.body.name
        character.surname = req.body.surname
        character.age = req.body.age
        character.description = req.body.description
        character.anime = req.body.anime
        if (req.body.image != null && req.body.image !== '') {
            saveImage(character, req.body.image)
        }
        await character.save()
        res.redirect(`/characters/${character.id}`)
    } catch {
        if (character == null) {
            res.redirect('/')
        } else {
            res.render('characters/edit', {
                character: character,
                animes: animes,
                errorMessage: 'Error updating Character'
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    let character
    try {
        character = await Character.findById(req.params.id)
        await character.remove()
        res.redirect('/characters')
    } catch {
        if (character == null) {
            res.redirect('/')
        } else {
            res.redirect(`/characters/${character.id}`)
        }
    }
})

function saveImage(character, imageEncoded) {
    if (imageEncoded == null) return
    const image = JSON.parse(imageEncoded)
    if (image != null && imageMimeTypes.includes(image.type)) {
        character.image = new Buffer.from(image.data, 'base64')
        character.imageType = image.type
    }
}

module.exports = router
