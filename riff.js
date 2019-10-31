const greeting_file = require('./conf/greeting.json')
const bot_secret = require('./lib/bot-secret')

const express = require('express');
const bodyParser = require('body-parser')
const voiceResponse = require('twilio').twiml.VoiceResponse

const app = express()
var greeting = greeting_file.greeting

const delay = 12000 // 12s delay
app.use(bodyParser.urlencoded({ extended: false }))

app.all('/answer', (req, res) => {
  const caller = req.body.From
  const twilioNumber = req.body.To

  // voice greeting
  const r = new voiceResponse()
  r.say(greeting.voice)
  res.send(r.toString())

  console.log("Voice: " + greeting.voice)

  // send text message
  var timer = setTimeout(function() {
    sendSMS(caller, twilioNumber)
  },delay)
  console.log("Text: " + greeting.sms)

})

function sendSMS(caller, twilioNumber) {
  const accountSid = bot_secret.twilio_sid
  const authToken = bot_secret.twilio_auth_token
  const client = require('twilio')(accountSid, authToken)

  return client.messages.create({
    body: greeting.sms,
    from: twilioNumber,
    to: caller,
  }).then()
    .catch(function(error) {
      if (error.code === 21614) {
        console.log("This caller can't receive SMS messages.")
      }
    })
    .done()
}

app.listen(8000)

