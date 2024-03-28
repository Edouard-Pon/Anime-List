if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const methodOverride = require('method-override')
const cors = require('cors')
const multer = require('multer')

const upload = multer({
    limits: {
        fileSize: 1024 * 1024 // 1 mb
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true)
        } else {
            cb(new Error('Not an image! Please upload an image file.'), false)
        }
    }
})

const characterRouter = require('./routes/character')
const animeRouter = require('./routes/anime')
const userRouter = require('./routes/user')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(cors())

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected to Mongoose'))

app.use('/characters', upload.single('image'), characterRouter)
app.use('/anime', upload.single('cover'), animeRouter)
app.use('/user', userRouter)

app.listen(process.env.PORT || 3000)
