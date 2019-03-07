const redis = require('redis')
const { promisify } = require('util')

const config = require('../config')

const client = redis.createClient({
  host: config.get('redis.host'),
  port: config.get('redis.port')
})

const getAsync = promisify(client.get).bind(client)
const setAsync = promisify(client.set).bind(client)

client.on("error", (err) => {
  console.log("Error " + err)
})

function setToCache(key, value, minsToExpire) {
  client.set(key, value)
  if (minsToExpire) {
    client.expire(key, minsToExpire)
  }
}

function getFromCache(key) {
  return getAsync(key)
}

module.exports.getFromCache = getFromCache

module.exports.setToCache = setToCache
