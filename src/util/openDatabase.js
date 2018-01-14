import mongoose from 'mongoose'
mongoose.set('debug', true)

mongoose.Promise = global.Promise

const openDatabase = dbUrl => mongoose.connect(dbUrl)


module.exports = openDatabase
