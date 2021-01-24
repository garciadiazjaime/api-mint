const express = require('express');
const cors = require('cors')

const router = express.Router();

const { Place } = require('../model/gmaps-place')
const categories = ['cafe', 'restaurant', 'bar']

router.get('/gmaps-place',  cors(), async (req, res) => {
  const promises = categories.map(category => Place.find({
    type: category
  }).limit(4))

  const places = await Promise.all(promises)

  const response = categories.map((category, index) => ({
    category,
    data: places[index]
  }))

  res.send(response)
});

router.get('/gmaps-place/:category',  cors(), async (req, res) => {
  const { category } = req.params

  const places = await Place.find({
    type: category
  })

  res.send(places)
});

module.exports = router;
