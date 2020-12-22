const express = require('express')
const cors = require('cors');
const debug = require('debug')('app:feedme')

const {
  getProfiles
} = require('../util/instagram')

const router = express.Router()

router.get('/feedme', cors(), async (req, res) => {
  debug(req.query.filters)
  const filters = JSON.parse(req.query.filters)

  const { first, state, lngLat: coordinates, username } = filters

  let profiles =  await getProfiles({ first, state, coordinates, username })

  profiles = profiles.filter(item => !item.mediaUrl.includes('video'))

  profiles = profiles.slice(0, 48).map(item => ({
    address: item.address,
    caption: item.caption,
    gps: item.gps,
    id: item.id,
    keywords: item.keywords,
    mediaUrl: item.mediaUrl,
    phone: item.phones[0],
    posts: item.posts,
    title: item.title,
    username: item.username,
  }))

  res.send(profiles)
})

module.exports = router
