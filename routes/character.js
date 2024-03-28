const express = require('express')
const router = express.Router()
const Character = require('../models/character')
const Anime = require('../models/anime')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const { body, validationResult } = require('express-validator')
const { authenticateAdmin } = require('../middleware/auth')


// Get all characters /characters TODO - Add pagination
router.get('/', async (req, res) => {
    try {
        let character =  await Character.find()
        character = character.map(character => {
            const { image, imageType, ...characterWithoutImage } = character._doc
            return { ...characterWithoutImage, imagePath: character.imagePath }
        })
        res.json({
            character: character,
        })
    } catch {
        res.status(500).json({ message: 'An error occurred while retrieving the data.' })
    }
})

// Get Character by ID /characters/:id
router.get('/:id', async (req, res) => {
    try {
        let character = await Character.findById(req.params.id)
        let anime = await  Anime.find({ _id: character.anime }).exec()
        const { image, imageType, ...characterWithoutImage } = character._doc
        character = { ...characterWithoutImage, imagePath: character.imagePath }
        anime = anime.map(anime => {
            const { coverImage, coverImageType, ...animeWithoutCoverImage } = anime._doc
            return { ...animeWithoutCoverImage, coverImagePath: anime.coverImagePath }
        })
        res.json({
            character: character,
            anime: anime
        })
    } catch {
        res.status(500).json({ message: 'An error occurred while retrieving the data.' })
    }
})

// Search Characters /characters/search
router.post('/search',
    body('name').trim().escape(),
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        let searchOptions = {}
        if (req.body.name != null && req.body.name !== '') {
            searchOptions.name = new RegExp(req.body.name, 'i')
        }
        try {
            let character =  await Character.find(searchOptions)
            character = character.map(character => {
                const { image, imageType, ...characterWithoutImage } = character._doc
                return { ...characterWithoutImage, imagePath: character.imagePath }
            })
            res.json({
                character: character,
                searchOptions: req.body
            })
        } catch {
            res.status(500).json({ message: 'An error occurred while retrieving the data.' })
        }
    }
)

// Create Character Route TODO - Create character in database
router.post('/create',
    authenticateAdmin,
    [
        body('name').optional().trim().escape(),
        body('originalName').optional().trim().escape(),
        body('description').optional().trim().escape(),
        body('anime').optional().toArray(),
    ],
    async (req, res) => {
        const character = new Character()
        if (req.body.name) character.name = req.body.name
        if (req.body.originalName) character.originalName = req.body.originalName
        if (req.body.description) character.description = req.body.description
        if (req.body.anime) character.anime = req.body.anime
        try {
            saveImage(character, req.file)
            const newCharacter = await character.save()
            res.json({ message: 'Character created successfully', character: newCharacter })
        } catch (err) {
            res.status(500).json({ message: 'Error creating Character', error: err.message })
        }
    }
)

// Update Character Route TODO - Update character in database
// router.put('/:id', async (req, res) => {
//     let character
//     const animes = await Anime.find({})
//     try {
//         character = await Character.findById(req.params.id)
//         character.name = req.body.name
//         character.surname = req.body.surname
//         character.age = req.body.age
//         character.description = req.body.description
//         character.anime = req.body.anime
//         if (req.body.image != null && req.body.image !== '') {
//             saveImage(character, req.body.image)
//         }
//         await character.save()
//         res.redirect(`/characters/${character.id}`)
//     } catch {
//         if (character == null) {
//             res.redirect('/')
//         } else {
//             res.render('characters/edit', {
//                 character: character,
//                 animes: animes,
//                 errorMessage: 'Error updating Character'
//             })
//         }
//     }
// })

// Delete Character Route TODO - Delete character in database
// router.delete('/:id', async (req, res) => {
//     let character
//     try {
//         character = await Character.findById(req.params.id)
//         await character.remove()
//         res.redirect('/characters')
//     } catch {
//         if (character == null) {
//             res.redirect('/')
//         } else {
//             res.redirect(`/characters/${character.id}`)
//         }
//     }
// })

function saveImage(character, imageEncoded) {
    if (imageEncoded == null) return
    if (imageMimeTypes.includes(imageEncoded.mimetype)) {
        character.image = imageEncoded.buffers
        character.imageType = imageEncoded.mimetype
    }
}

module.exports = router
