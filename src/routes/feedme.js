const express = require('express')
const cors = require('cors');

const {
  getProfiles
} = require('../util/instagram')

const router = express.Router()

router.get('/feedme', cors(), async (req, res) => {
  const { first, state, lng, lat, username, categories = '' } = req.query

  const coordinates = [lng, lat]

  const categoriesList = categories.split(',')

  const promises = categoriesList.map(async (category) => getProfiles({ first: parseInt(first) + 20, state, coordinates, username, category }))
  const data = await Promise.all(promises)
  
  
  const profiles = {}
  categoriesList.forEach((category, index) => {
    profiles[category] = data[index].filter(item => !item.mediaUrl.includes('video')).slice(0, first).map(item => ({
      address: item.address,
      caption: item.caption,
      gps: item.gps,
      id: item.id,
      keywords: item.keywords,
      mediaUrl: item.mediaUrl,
      permalink: item.permalink,
      phone: item.phones[0],
      title: item.title,
      username: item.username,
    }))
  })

  res.send(profiles)
})

module.exports = router
