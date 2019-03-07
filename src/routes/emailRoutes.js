const express = require('express')

const { emailSend } = require('../services/emailService')

const router = express.Router()

router.post('/email', (req, res) => {
  const { account } = req.query
  const { body } = req

  emailSend(account, body)
    .then(() => {
      res.send()
    })
    .catch(error => {
      res.status(500).send(error)
    })
})

module.exports = router
