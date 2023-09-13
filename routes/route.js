const express = require('express')
const router = express.Router()
const {downloadYoutubeVideo} = require('../controller/YTcontroller')


router.get('/downloadYoutubeVideo', downloadYoutubeVideo)


module.exports = {router}