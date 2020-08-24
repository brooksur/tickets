import { useEffect } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

export default () => {
  const sendRequest = useRequest({
    url: '/api/users/signout',
    method: 'post'
  })

  useEffect(() => {
    sendRequest({
      onSuccess() {
        Router.push('/')
      }
    })
  }, [])

  return <div>Signing you out...</div>
}
