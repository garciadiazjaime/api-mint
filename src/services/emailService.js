const mongoose = require('mongoose')
const sgMail = require('@sendgrid/mail')

const EmailModel = require('../model/emailModel')
const config = require('../config')

mongoose.Promise = global.Promise

sgMail.setApiKey(config.get('sendgrid.token'));

const whiteListAccounts = {
  'focusmx': 'info@focus.mx',
  'focusmx:test': 'info@mintitmedia.com'
}

async function emailSend(account, body) {
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


module.exports.emailSend = emailSend
