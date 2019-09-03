import logger from './utils/logger'

require('dotenv').config()

const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const cors = require('cors')
const claimController = require('./controllers/claimController')

const mongoURI = process.env.MONGODB_URI

// Apply middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

// Set up default mongoose connection
mongoose
  .connect(
    mongoURI || 'mongodb://localhost:27017/linkdropsafemodule',
    {
      useNewUrlParser: true,
      useCreateIndex: true
    }
  )
  .then(() => {
    // Run server
    const PORT = process.env.PORT || 5000

    app.listen(PORT, () => {
      logger.info(`Server is up on port ${PORT}`)
    })
  })
  .catch(err => {
    logger.error(err)

    process.exit(1)
  })

// Define routes
app.get('/', (req, res) => res.send(`Linkdrop Safe Module Relayer`))
app.post('/linkdrops/claim', asyncHandler(claimController.claim))
app.post('/linkdrops/claim-erc721', asyncHandler(claimController.claimERC721))

// Error handling
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500)
  let error = err.message || 'Server error!'
  res.send({ success: false, error })
  return null
})
