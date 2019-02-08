import Twitter from 'twitter'

import config from '../config'

const url = {
  tweets: 'statuses/user_timeline'
}

const whiteListAccounts = {
  'focusmx': 'focus_bc'
}

const getProps = () => ({
  consumer_key: config.get(`twitter.ckey`),
  consumer_secret: config.get(`twitter.csecret`),
  access_token_key: config.get(`twitter.otoken`),
  access_token_secret: config.get(`twitter.osecret`)
})

const getParams = twitterUser => ({
  screen_name: twitterUser
})

const client = new Twitter(getProps())

export async function getTweets(account) {
  const twitterUser = whiteListAccounts[account]

  if (account && twitterUser) {
    return new Promise((resolve, reject) => {
      const params = getParams(twitterUser)

      client.get(url.tweets, params, (error, tweets) => {
        if (error) {
          reject(error)
        } else {
          resolve(tweets)
        }
      })
    })
  }

  return Promise.reject('invalid params')
}
