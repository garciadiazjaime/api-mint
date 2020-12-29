const express = require('express');
const cors = require('cors')

const router = express.Router();

const { Place } = require('../model/gmaps-place')

router.get('/gmaps-place/:category',  cors(), async (req, res) => {
  const { category } = req.params

  const places = await Place.find({
    type: category
  })

  res.send(places)
});

module.exports = router;
