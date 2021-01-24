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

  const response = categories.map((slug, index) => ({
    slug,
    data: places[index]
  }))

  res.send(response)
});

router.get('/gmaps-place/:category',  cors(), async (req, res) => {
  const { category } = req.params
  const { limit = 20 } = req.query

  const places = await Place.find({
    type: category
  }).limit(limit)

  res.send([{
    slug: category,
    data: places
  }])
});

module.exports = router;
