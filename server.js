if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const methodOverride = require('method-override')

const characterRouter = require('./routes/characters')
const animeRouter = require('./routes/animes')
const profileRouter = require('./routes/profile')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected to Mongoose'))

app.use('/characters', characterRouter)
app.use('/anime', animeRouter)
app.use('/profile', profileRouter)

app.listen(process.env.PORT || 3000)
