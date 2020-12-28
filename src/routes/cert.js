const express = require('express')

const router = express.Router()

router.get('/.well-known/acme-challenge/:filename', async (req, res) => {
  res.send('6_1PNRKyBvlKE_lq6BD2TEylIsh-UkTtX9O_ICaVA7c.ROJt6qUhmmn0UaHbd-OcDEiLZVnE6klzI57DmiEMZHA')
})

module.exports = router
