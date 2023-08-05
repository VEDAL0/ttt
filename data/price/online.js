

const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
  guildId: String,
  price: Number
})

module.exports = mongoose.model('price_online', Schema)
