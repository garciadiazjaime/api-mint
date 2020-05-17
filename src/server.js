if (process.env.NODE_ENV === 'production') {
  require('newrelic');
}
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const apiNewsRoute  = require('mint-api-news').default
const apiEventsRoute  = require('mint-api-events').default
const cors = require('cors')
const debug = require('debug')('app:server')

const apiEmailRoute = require('./routes/emailRoutes')
const apiTwitterRoute = require('./routes/twitterRoutes')
const apiCaptionRoute = require('./routes/captionRoutes')
const realStateRoutes = require('./routes/realStateRoutes')
const instragramRoutes = require('./routes/instagramRoutes')
const wordRoute = require('./routes/word')
const route = require('./routes')

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


openDatabase(props.dbUrl)
  .then(() => {
    app.use('/', apiNewsRoute)
    app.use('/', apiEventsRoute)
    app.use('/', apiEmailRoute)
    app.use('/', apiTwitterRoute)
    app.use('/', apiCaptionRoute)
    app.use('', realStateRoutes)
    app.use('/', instragramRoutes)
    app.use('', wordRoute),
    app.use('', route)
    app.listen(props.port, props.ip, () => debug(`Express Running ${props.ip}:${props.port}`))
  })
  .catch(debug)
