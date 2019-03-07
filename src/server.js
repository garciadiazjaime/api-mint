const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const apiNewsRoute  = require('mint-api-news').default
const apiEventsRoute  = require('mint-api-events').default
const cors = require('cors')

const apiEmailRoute = require('./routes/emailRoutes')
const apiTwitterRoute = require('./routes/twitterRoutes')
const apiCaptionRoute = require('./routes/captionRoutes')
const openDatabase = require('./util/openDatabase')
const config = require('./config')

const props = {
  ip: config.get('ip'),
  port: config.get('port'),
  dbUrl: config.get('db.url')
}
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ extended: true, limit: '1mb' }))
app.use(morgan('tiny'))

const startApp = confg =>
  app.listen(confg.port, confg.ip, () => console.log(`Express Running ${confg.ip}:${confg.port}`))

openDatabase(props.dbUrl)
  .then(() => {
    app.use('/', apiNewsRoute)
    app.use('/', apiEventsRoute)
    app.use('/', apiEmailRoute)
    app.use('/', apiTwitterRoute)
    app.use('/', apiCaptionRoute)
    startApp(props)
  })
  .catch(console.log)
