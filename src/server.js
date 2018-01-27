import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import apiNewsRoute  from 'mint-api-news'
import apiEventsRoute  from 'mint-api-events'

import apiEmailRoute from './routes/emailRoutes'
import apiTwitterRoute from './routes/twitterRoutes'
import openDatabase from './util/openDatabase'
import config from './config'

const props = {
  ip: config.get('ip'),
  port: config.get('port'),
  dbUrl: config.get('db.url')
}
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('tiny'))

const startApp = confg =>
  app.listen(confg.port, confg.ip, () => console.log(`Express Running ${confg.ip}:${confg.port}`))

openDatabase(props.dbUrl)
  .then(() => {
    app.use('/', apiNewsRoute)
    app.use('/', apiEventsRoute)
    app.use('/', apiEmailRoute)
    app.use('/', apiTwitterRoute)
    startApp(props)
  })
  .catch(console.log)
