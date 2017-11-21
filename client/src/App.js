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
  updateSender
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

    <Button color='primary' size='lg' block onClick={() => { alert('not yet!') }}>
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

  render() {
    return <AppPureUI {...this.state} {...this.updaters} />
  }
}

