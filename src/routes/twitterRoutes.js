import express from 'express'
import Twitter from 'twitter'

import EventModel from '../model/emailModel'
import { getTweets } from '../services/twitterService'
import config from '../config'

const router = express.Router()

router.get('/twitter', (req, res) => {
  const { account } = req.query
  getTweets(account)
    .then(tweets => {
      res.send({
        tweets
      })
    })
    .catch(error => {
      res.status(500).send(error)
    })
})

export default router
