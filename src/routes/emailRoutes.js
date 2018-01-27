import express from 'express'
import mongoose from 'mongoose'

import EventModel from '../model/emailModel'

mongoose.Promise = global.Promise

const router = express.Router()

router.post('/email', (req, res) => {
  const { data } = req.body
  const email = new EventModel(data)
    email.save()
      .then(results => {
        res.send({
          status: true
        })
      })
      .catch(error => {
        res.send({
          status: false,
          error
        })
      })
})

export default router
