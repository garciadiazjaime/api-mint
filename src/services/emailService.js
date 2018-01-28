import mongoose from 'mongoose'
import sgMail from '@sendgrid/mail'

import EmailModel from '../model/emailModel'
import config from '../config'

mongoose.Promise = global.Promise

sgMail.setApiKey(config.get('sendgrid.token'));

const whiteListAccounts = {
  'focusmx': 'jaime@mintitmedia.com' // info@focus.mx
}

export async function emailSend(account, body) {
  const toEmail = whiteListAccounts[account]
  const { from, subject, message } = body

  if (toEmail && from && subject && message) {
    const emailHandler = new EmailModel({ from, subject, message, to: toEmail })
    await emailHandler.save()
    const msg = {
      to: toEmail,
      from,
      subject,
      text: message,
      html: message,
    }
    return sgMail.send(msg)
  }

  return Promise.reject('invalid params') 
}
