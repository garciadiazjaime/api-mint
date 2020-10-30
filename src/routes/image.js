const express = require('express')
const multer = require("multer");

const upload = multer({
  dest: "./tmp"
});

const { save } = require('../services/image')

const router = express.Router()

router.post('/image/:entity/:id', upload.single("file"), (req, res) => {
  const { entity, id } = req.params
  save(req.file, { entity, id })
    .then(response => {
      res.send(response)
    })
    .catch(error => {
      res.status(500).send(error)
    })
})

module.exports = router
