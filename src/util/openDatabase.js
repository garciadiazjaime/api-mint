const mongoose = require('mongoose')

const openDatabase = dbUrl => mongoose.connect(dbUrl)
mongoose.Promise = global.Promise

module.exports = openDatabase
