const mongoose = require('mongoose')
const config = require('../utils/config')

const url = config.MONGODB_URI

mongoose.connect(url)

  const towerSchema = new mongoose.Schema({
    type: String,
    category: String,
    cost: Number,
    description: String,
    image: String,
    upgrades: Array
})

  towerSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Tower', towerSchema)