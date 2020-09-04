'use strict'

const autocannon = require('autocannon')

const apiURL = 'http://0.0.0.0:3030'

async function main () {
 const resultGraphql = await autocannon({
  url: `${apiURL}/instagram/profiles?lng=-117.034312812596&lat=32.5286806999987&state=MAPPED`,
  connections: 10,
  pipelining: 1,
  duration: 10
 })
 console.log('resultGraphql', resultGraphql)

 const resultGet = await autocannon({
  url: apiURL,
  connections: 10,
  pipelining: 1,
  duration: 10,
  requests: [
    {
      method: 'POST',
      path: '/graphiql',
      headers: {
        'Content-type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        query: '{ profile(first: 100, coordinates: [-117.034312812596,32.5286806999987], state: "MAPPED", username: "") { id  username  title  mediaUrl  caption  phones  keywords  address  dist  rank  posts {   mediaUrl   caption  } }}'
       })
    }
  ],
  idReplacement: true
 })

 console.log('resultGet', resultGet)
}

main()
