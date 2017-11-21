import React, { Component } from 'react'
import './App.css'
import {
  Form,
  FormGroup,
  Label,
  Input as DumbInput,
  Button
} from 'reactstrap'

const Input = (props) => <DumbInput {...props} onChange={e => { props.onChange(e.target.value) }} />

// https://stackoverflow.com/questions/8188645/javascript-regex-to-match-a-url-in-a-field-of-text
const urlMatchRe = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/g

const shortenUrl = (url) => fetch(`/shorten?url=${url}`).then(r => r.json()).then(r => r.shortenedUrl)

const replaceUrls = (message) => {
  const longUrls = message.match(urlMatchRe) || []
  return Promise.all(longUrls.map(shortenUrl))
    .then((shortUrls) => message.replace(urlMatchRe, (longUrl) => shortUrls[longUrls.indexOf(longUrl)]))
}

const sendSMS = ({ message, from, to }) => {
  return fetch(`/sms?from=${from}&to=${to}&message=${message}`).then(r => r.json())
}

const initialPhoneNumber = '61406369533'
const initialMessage1 = 'Hi Francesco, we want to hire you! Just kidding, we just forgot to change the default message and recipient. Check out this video https://www.youtube.com/watch?v=NHo7fSJ9ItE'
const initialSender = 'BurstSMS'

const initialState = {
  phoneNumber: initialPhoneNumber,
  message: initialMessage1,
  sender: initialSender
}

const updateField = (fieldName) => (newValue) => () => ({ [fieldName]: newValue })
const updateMessage = (newValue) => {
  if (newValue.length <= 240) {
    return updateField('message')(newValue)
  }
}
const updatePhoneNumber = updateField('phoneNumber')
const updateSender = updateField('sender')

const AppPureUI = ({
  phoneNumber,
  message,
  sender,
  updateMessage,
  updatePhoneNumber,
  updateSender,
  sendMessage
}) => (
  <Form>

    <FormGroup>
      <Label for='sender'>Sender</Label>
      <Input
        id='sender'
        placeholder='Set the SMS sender'
        value={sender}
        onChange={updateSender}
      />
    </FormGroup>

    <FormGroup>
      <Label for='phoneNumber'>Phone Number</Label>
      <Input
        id='phoneNumber'
        placeholder='Set the Phone Number'
        value={phoneNumber}
        onChange={updatePhoneNumber}
      />
    </FormGroup>

    <FormGroup>
      <Label for='phoneNumber'>Message</Label>
      &nbsp;
      <em>({240 - message.length} remaining chars)</em>
      <Input
        type='textarea'
        id='message'
        placeholder='Write a SMS'
        value={message}
        onChange={updateMessage}
      />
    </FormGroup>

    <Button color='primary' size='lg' block onClick={sendMessage}>
      SEND MESSAGE
    </Button>

  </Form>
)

export default class App extends Component {

  state = initialState

  updaters = {
    updateMessage: (newValue) => { this.setState(updateMessage(newValue)) },
    updatePhoneNumber: (newValue) => { this.setState(updatePhoneNumber(newValue)) },
    updateSender: (newValue) => { this.setState(updateSender(newValue)) }
  }

  actions = {
    sendMessage: () => {
      return replaceUrls(this.state.message)
        .then(newMessage => {
          return sendSMS({ message: newMessage, from: this.state.sender, to: this.state.phoneNumber })
        })
        .then(response => {
          if (response.error.description === 'OK') {
            alert('message sent')
          } else {
            alert('message might not be sent ¯\_(ツ)_/¯') // eslint-disable-line no-useless-escape
          }
        })
    }
  }

  render() {
    return <AppPureUI {...this.state} {...this.updaters} {...this.actions} />
  }
}

