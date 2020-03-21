const express = require('express')
const graphqlHTTP = require('express-graphql')

const realStateSchema = require('../schema/realStateSchema')
const { save } = require('../services/realStateService')

const router = express.Router()

router.use('/real-state/graphiql', graphqlHTTP(() => ({
  schema: realStateSchema,
  graphiql: true,
})))

router.post('/real-state', async (req, res) => {
  const { data } = req.body

  if (!data || !data.length) {
    return res.send()
  }

  const response = await Promise.all(data.map(save))

  res.send(response)
})


module.exports = router
