import { useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'
import ErrorMessages from '../../components/ErrorMessages'

export default () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessages, setErrorMessages] = useState(null)

  const sendRequest = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: { email, password }
  })

  const onSubmit = async event => {
    event.preventDefault()

    sendRequest({
      onSuccess(response) {
        Router.push('/')
      },
      onFailure(response) {
        const messages = response.data.errors.map(e => e.message)
        setErrorMessages(messages)
      }
    })
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          className="form-control"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      {errorMessages && <ErrorMessages messages={errorMessages} />}
      <button className="btn btn-primary">Sign Up</button>
    </form>
  )
}
