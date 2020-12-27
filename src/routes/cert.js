const express = require('express')

const router = express.Router()

router.get('/.well-known/acme-challenge/:filename', async (req, res) => {
  res.send('8dtGgCLha2B6DovhaP6_jqIynr-x61XmR9i5ee0EKK8.ROJt6qUhmmn0UaHbd-OcDEiLZVnE6klzI57DmiEMZHA')
})

module.exports = router
