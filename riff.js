var bot_secret = require('./lib/bot-secret')

var welcome_message = "Thank you for contacting $O$. We are here to help people who need it. Please reply to this message to continue."

const express = require('express');
const bodyParser = require('body-parser')
const voiceResponse = require('twilio').twiml.VoiceResponse

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))

var twilioNumber = bot_secret.twilio_number

app.all('/answer', (req, res) => {
  const caller = req.body.From
  const twilioNumber = req.body.To
  sendSms(caller, twilioNumber)

  const r = new voiceResponse()
  r.say('Thank you for calling SOS! We are here to help. We have sent you a text message with an introduction. Please respond to continue.')
  res.send(r.toString())
})

function sendSms(caller, twilioNumber) {
  const accountSid = bot_secret.twilio_sid
  const authToken = bot_secret.twilio_auth_token
  const client = require('twilio')(accountSid, authToken)

  return client.messages.create({
    body: "Thank you for contacting $O$. We are here to help people who need it. Please reply to this message to continue.",
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

