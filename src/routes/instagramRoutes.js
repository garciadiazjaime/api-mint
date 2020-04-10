const express = require('express')
const graphqlHTTP = require('express-graphql')

const instagramSchema = require('../schema/instagramSchema')
const { savePost, schedule, remove, getPost, saveBrand, updateBrand, addBrandToPost } = require('../services/instagramService')

const router = express.Router()

router.use('/instagram/graphiql', graphqlHTTP(() => ({
  schema: instagramSchema,
  graphiql: true,
})))

router.post('/instagram/post', async (req, res) => {
  const { data } = req.body

  if (!data || !data.length) {
    return res.send()
  }

  const response = await Promise.all(data.map(savePost))

  res.send(response)
})

router.post('/instagram/post/:postId/brand', async (req, res) => {
  const { postId } = req.params
  const { brand, postState } = req.body

  const post = await getPost(postId)

  const brandResponse = await saveBrand(brand)

  const postResponse = await addBrandToPost(post, brandResponse, postState)

  res.send({
    brandResponse,
    postResponse
  })
})

router.post('/instagram/post/:postId/schedule', async (req, res) => {
  const{ postId } = req.params

  const response = await schedule(postId)

  res.send(response)
})

router.post('/instagram/post/:postId/remove', async (req, res) => {
  const{ postId } = req.params

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

module.exports = router
