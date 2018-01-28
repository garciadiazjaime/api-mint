import express from 'express'

import { emailSend } from '../services/emailService'

const router = express.Router()

router.post('/email', (req, res) => {
  const { account } = req.query
  const { body } = req

  emailSend(account, body)
    .then(() => {
      res.send()
    })
    .catch(error => {
      res.status(500).send(error)
    })
})

export default router
