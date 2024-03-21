const mongoose = require('mongoose')
const config = require('../utils/config')

const url = config.MONGODB_URI

mongoose.connect(url)

const leaderboardSchema = new mongoose.Schema({
        date: String,
        scores: Array,
  })

  
  leaderboardSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Leaderboard', leaderboardSchema)