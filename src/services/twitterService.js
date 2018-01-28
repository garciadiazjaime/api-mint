import Twitter from 'twitter'

import { getFromCache, setToCache } from './cacheService'
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
    const cacheKey = `tw_${account}`
    const data = await getFromCache(cacheKey)

    if (data) {
      return Promise.resolve(JSON.parse(data))
    } else {
      return new Promise((resolve, reject) => {
        const params = getParams(twitterUser)

        client.get(url.tweets, params, (error, tweets) => {
          if (error) {
            reject(error)
          } else {
            setToCache(cacheKey, JSON.stringify(tweets), 3600)
            resolve(tweets)
          }
        })
      })
    }
  }
  return Promise.reject()
}
