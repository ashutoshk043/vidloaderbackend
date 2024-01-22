const express = require('express')
const {router} = require('./routes/route')
const multer = require('multer')
const cors = require('cors')
const app = express()
const port = 3000
app.use(cors())
app.use(express.json())
app.use(multer().any())
app.use('/', router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})