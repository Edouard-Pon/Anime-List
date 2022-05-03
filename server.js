if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const characterRouter = require('./routes/characters')
const animeRouter = require('./routes/animes')
const profileRouter = require('./routes/profile')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.static('node_modules/filepond/dist'))
app.use(express.static('node_modules/filepond-plugin-image-preview/dist'))
app.use(express.static('node_modules/filepond-plugin-file-encode/dist'))
app.use(express.static('node_modules/filepond-plugin-image-resize/dist'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, (error) => { if (error) console.log(error) })
mongoose.connection.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/characters', characterRouter)
app.use('/anime', animeRouter)
app.use('/profile', profileRouter)

app.listen(process.env.PORT || 3000)
