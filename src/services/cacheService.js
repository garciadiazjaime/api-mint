import redis from 'redis'
import { promisify } from 'util'

import config from '../config'

const client = redis.createClient({
  host: config.get('redis.host'),
  port: config.get('redis.port')
})

const getAsync = promisify(client.get).bind(client)
const setAsync = promisify(client.set).bind(client)

client.on("error", (err) => {
  console.log("Error " + err)
})

export const getFromCache = (key) => {
  return getAsync(key)
}

export const setToCache = (key, value, minsToExpire) => {
  client.set(key, value)
  if (minsToExpire) {
    client.expire(key, minsToExpire)
  }
}
