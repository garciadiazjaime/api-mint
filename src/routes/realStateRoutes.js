const express = require('express')

const { savePlace } = require('../services/realStateService.js')

const router = express.Router()

router.post('/real-state/place', async (req, res) => {
  const { places } = req.body

  if (!places || !places.length) {
    return res.send()
  }

  await Promise.all(places.map(savePlace))

  res.send()
})

module.exports = router
