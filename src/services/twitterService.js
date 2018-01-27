import Twitter from 'twitter'

import config from '../config'

const whiteListAccounts = ['focusmx']

const getProps = account => ({
  consumer_key: config.get(`twitter.${account}.ckey`),
  consumer_secret: config.get(`twitter.${account}.csecret`),
  access_token_key: config.get(`twitter.${account}.otoken`),
  access_token_secret: config.get(`twitter.${account}.osecret`)
})

export function getTwitters(account) {
  return new Promise((resolve, reject) => {
    if (account && whiteListAccounts.includes(account)) {
      const client = new Twitter(getProps(account))
      const params = {
        screen_name: config.get(`twitter.${account}.name`)
      }

      client.get('statuses/user_timeline', params, (error, tweets) => {
        if (error) {
          reject(error)
        } else {
          resolve(tweets)
        }
      })
    } else {
      reject()
    }
  })
}
