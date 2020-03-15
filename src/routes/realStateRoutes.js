const express = require('express')
const graphqlHTTP = require('express-graphql')

const realStateSchema = require('../schema/realStateSchema')
const { savePlace } = require('../services/realStateService.js')

const router = express.Router()

router.use('/real-state/place', graphqlHTTP(() => ({
  schema: realStateSchema,
  graphiql: true,
})))

router.post('/real-state', async (req, res) => {
  const { data } = req.body

  if (!data || !data.length) {
    return res.send()
  }

  await Promise.all(data.map(savePlace))

  res.send()
})


module.exports = router
