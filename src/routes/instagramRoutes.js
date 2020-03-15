const express = require('express')
const graphqlHTTP = require('express-graphql')

const instagramSchema = require('../schema/instagramSchema')
const { save } = require('../services/instagramService')

const router = express.Router()

router.use('/instagram/graphiql', graphqlHTTP(() => ({
  schema: instagramSchema,
  graphiql: true,
})))

router.post('/instagram', async (req, res) => {
  const { data } = req.body

  if (!data || !data.length) {
    return res.send()
  }

  const response = await Promise.all(data.map(save))

  res.send(response)
})

module.exports = router
