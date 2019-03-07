const express = require('express')
const Twitter = require('twitter')

const EventModel = require('../model/emailModel')
const { getTweets } = require('../services/twitterService')
const config = require('../config')

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

module.exports = router
