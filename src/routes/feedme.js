const express = require('express')

const {
  getProfiles
} = require('../util/instagram')

const router = express.Router()

router.post('/feedme', async (req, res) => {
  const { first, state, lngLat: coordinates, username } = req.body

  const profiles =  await getProfiles({ first, state, coordinates, username })

  res.send(profiles)
})

module.exports = router
