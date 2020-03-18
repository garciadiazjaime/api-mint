const express = require('express')
const graphqlHTTP = require('express-graphql')

const instagramSchema = require('../schema/instagramSchema')
const { save, schedule } = require('../services/instagramService')

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

router.post('/instagram/post/:postId/schedule', async (req, res) => {
  const{ postId } = req.params

  const response = await schedule(postId)

  res.send(response)
})

module.exports = router
