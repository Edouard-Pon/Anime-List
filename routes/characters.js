const express = require('express')
const router = express.Router()
const Character = require('../models/character')
const Anime = require('../models/anime')

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
router.get('/new',  (req, res) => {
    res.render('characters/new', { character: new Character() })
})

// Create Character Route
router.post('/', async (req, res) => {
    const character = new Character({
        name: req.body.name
    })
    try {
        const newCharacter = await character.save()
        res.redirect(`characters/${newCharacter.id}`)
    } catch {
        res.render('characters/new', {
            character: character,
            errorMessage: 'Error creating Character'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const character = await Character.findById(req.params.id)
        const animes = await  Anime.find({ character: character.id }).limit(12).exec()
        res.render('characters/show', {
            character: character,
            animesByCharacter: animes
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const character = await Character.findById(req.params.id)
        res.render('characters/edit', { character: character })
    } catch {
        res.redirect('/characters')
    }
})

router.put('/:id', async (req, res) => {
    let character
    try {
        character = await Character.findById(req.params.id)
        character.name = req.body.name
        await character.save()
        res.redirect(`/characters/${character.id}`)
    } catch {
        if (character == null) {
            res.redirect('/')
        } else {
            res.render('characters/edit', {
                character: character,
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

module.exports = router
