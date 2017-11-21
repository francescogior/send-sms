const express = require('express')
const path = require('path')
const request = require('request')
const fs = require('fs')

const { bitlyToken, burstApiKey, burstApiSecret } =  JSON.parse(fs.readFileSync('../.env', 'utf8'));

const bitlyEndpoint = 'https://api-ssl.bitly.com/v3/shorten'
const burstEndpoint = 'https://api.transmitsms.com/send-sms.json'

const app = express()

app.get('/shorten', ({ query }, res) => {  
  request(`${bitlyEndpoint}?longUrl=${query.url}&access_token=${bitlyToken}`, (error, response, body) => {
    res.json({ shortenedUrl: JSON.parse(body).data.url })
  })
})

app.get('/sms', ({ query }, res) => {
  const { message, to, from } = query;
  if (message.length > 240) {
    res.json({ error: { description: 'message is too long '} })
  } else {
    request.post(burstEndpoint, {
      auth: { username: burstApiKey, password: burstApiSecret },
      form: { message, to, from }
    }, (error, response, body) => {
      res.json(JSON.parse(body))
    })
  }
})

app.use(express.static(path.resolve(__dirname, '../client/build')))
app.listen(process.env.PORT || 3000)