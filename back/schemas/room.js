const mongoose = require('mongoose')
const config = require('../utils/config')

const url = config.MONGODB_URI

mongoose.connect(url)

const roomSchema = new mongoose.Schema({
        code: String,
        turn: String,
        players: Array,
        guesses: Array,
        chat: Array,
        answer: Object,
        created: Date,
})

  roomSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Room', roomSchema)