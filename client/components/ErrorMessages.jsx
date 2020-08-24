import React from 'react'
import shortid from 'shortid'

export default ({ messages }) => (
  <div className="alert alert-danger">
    <h4>Errors</h4>
    <ul className="my-0">
      {messages.map(m => (
        <li key={shortid.generate}>{m}</li>
      ))}
    </ul>
  </div>
)
