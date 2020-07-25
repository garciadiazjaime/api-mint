const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const openDatabase = dbUrl => mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})


module.exports = openDatabase
