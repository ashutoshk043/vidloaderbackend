const express = require('express')
const router = express.Router()
const {downloadYoutubeVideo, getVideoDetails} = require('../controller/YTcontroller')

router.post('/getVideoDetails', getVideoDetails)
router.get('/downloadYoutubeVideo', downloadYoutubeVideo)


module.exports = {router}