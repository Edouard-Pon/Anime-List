const express = require('express')
const router = express.Router()
const Character = require('../models/character')
const Anime = require('../models/anime')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const { body, validationResult } = require('express-validator')


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
// router.post('/', async (req, res) => {
//     const character = new Character({
//         name: req.body.name,
//         surname: req.body.surname,
//         age: req.body.age,
//         anime: req.body.anime,
//         description: req.body.description
//     })
//     try {
//         saveImage(character, req.body.image)
//         const newCharacter = await character.save()
//         res.redirect(`characters/${newCharacter.id}`)
//     } catch {
//         const animes = await Anime.find({})
//         res.render('characters/new', {
//             character: character,
//             animes: animes,
//             errorMessage: 'Error creating Character'
//         })
//     }
// })

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
    const image = JSON.parse(imageEncoded)
    if (image != null && imageMimeTypes.includes(image.type)) {
        character.image = new Buffer.from(image.data, 'base64')
        character.imageType = image.type
    }
}

module.exports = router
