
const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
  userId: String
})

module.exports = mongoose.model('blacklist', Schema)
