const express = require('express')

const { savePost, saveLocation, saveUser, schedule, remove, getPost, saveBrand, updateBrand, updatePostState } = require('../services/instagramService')

const {
  getProfiles
} = require('../util/instagram')

const router = express.Router()

router.post('/instagram/post', async (req, res) => {
  const { body: post } = req

  if (!post || !post.id) {
    return res.send()
  }

  const { location, user } = post
  if (location) {
    await saveLocation(location)
  }
  if (user) {
    await saveUser(user)
  }

  const response = await savePost(post)

  res.send(response)
})

router.post('/instagram/post/:postId/brand', async (req, res) => {
  const { postId } = req.params
  const { brand, postState } = req.body

  const post = await getPost(postId)

  const brandResponse = await saveBrand(brand)

  const postResponse = await updatePostState(post, brandResponse, postState)

  res.send({
    brandResponse,
    postResponse
  })
})

router.post('/instagram/post/:postId/schedule', async (req, res) => {
  const { postId } = req.params

  const response = await schedule(postId)

  res.send(response)
})

router.post('/instagram/post/:postId/remove', async (req, res) => {
  const { postId } = req.params

  const response = await remove(postId)

  res.send(response)
})

router.post('/instagram/brands/meta', async (req, res) => {
  const { data } = req.body

  if (!Array.isArray(data) || !data.length) {
    return res.send()
  }

  const response = await Promise.all(data.map(updateBrand))

  res.send(response)
})

router.get('/instagram/profiles', async (req, res) => {
  const { first = 100, state, lng, lat, username } = req.query
  if (!lng || !lat) {
    return res.status(500).send('error')
  }

  const profiles = await getProfiles({ first: parseInt(first), state, coordinates: [parseFloat(lng), parseFloat(lat)], username })

  res.send(profiles)
})

module.exports = router
