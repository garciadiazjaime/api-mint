import Twitter from 'twitter'

import { getFromCache, setToCache } from './cacheService'
import config from '../config'

const url = {
  tweets: 'statuses/user_timeline'
}

const whiteListAccounts = ['focusmx']

const getProps = account => ({
  consumer_key: config.get(`twitter.${account}.ckey`),
  consumer_secret: config.get(`twitter.${account}.csecret`),
  access_token_key: config.get(`twitter.${account}.otoken`),
  access_token_secret: config.get(`twitter.${account}.osecret`)
})

const getParams = account => ({
  screen_name: config.get(`twitter.${account}.name`)
})

export async function getTweets(account) {
  const key = `tw_${account}`
  if (account && whiteListAccounts.includes(account)) {
    const data = await getFromCache(key)

    if (data) {
      return Promise.resolve(JSON.parse(data))
    } else {
      return new Promise((resolve, reject) => {
        const client = new Twitter(getProps(account))
        const params = getParams(account)

        client.get(url.tweets, params, (error, tweets) => {
          if (error) {
            reject(error)
          } else {
            setToCache(key, JSON.stringify(tweets), 3600)
            resolve(tweets)
          }
        })
      })
    }
  }
  return Promise.reject()
}
