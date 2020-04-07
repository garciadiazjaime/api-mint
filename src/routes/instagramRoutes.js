const express = require('express')
const graphqlHTTP = require('express-graphql')

const instagramSchema = require('../schema/instagramSchema')
const { save, schedule, remove, getPost, saveUser, addUserToPost } = require('../services/instagramService')

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

  const response = await Promise.all(data.map(save))

  res.send(response)
})

router.post('/instagram/post/:postId/place', async (req, res) => {
  const{ postId } = req.params
  const { user, location, state } = req.body

  const post = await getPost(postId)

  const userResponse = await saveUser(user, location, post)

  const postResponse = await addUserToPost(post, userResponse, state)

  res.send({
    userResponse,
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

module.exports = router
