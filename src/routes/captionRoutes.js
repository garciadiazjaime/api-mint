const express = require('express')

const { saveCaption } = require('../services/captionService')

const router = express.Router()

router.post('/caption', (req, res) => {
  saveCaption(req.body)
    .then(() => {
      res.send()
    })
    .catch(error => {
      res.status(500).send(error)
    })
})

module.exports = router
