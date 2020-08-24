import request from 'supertest'
import { app } from '../../app'

it('should return correct response when cookie is present', async () => {
  const cookie = await global.signup()
  const res = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .expect(200)
  const { currentUser } = res.body
  expect(currentUser.email).toBeTruthy()
  expect(currentUser.id).toBeTruthy()
})

it('should return null when cookie is not present', async () => {
  const res = await request(app).get('/api/users/currentuser')
  expect(res.body.currentUser).toBe(null)
})
