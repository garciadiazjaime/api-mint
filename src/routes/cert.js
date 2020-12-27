const express = require('express')
const debug = require('debug')('app:cert')

const router = express.Router()

router.get('/.well-known/acme-challenge/:filename', async (req, res) => {
  debug(req.params.filename)
  res.send('OK')
})

module.exports = router
