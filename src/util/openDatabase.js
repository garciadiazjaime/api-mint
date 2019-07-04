const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const openDatabase = dbUrl => mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
})


module.exports = openDatabase
