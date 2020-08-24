import request from 'supertest'
import faker from 'faker'
import { app } from '../../app'

interface Body {
  email: string
  password: string
}

let body: Body

beforeEach(async () => {
  body = {
    email: faker.internet.email(),
    password: faker.internet.password(8)
  }
  await request(app).post('/api/users/signup').send(body)
})

const run = () => request(app).post('/api/users/signout').send({})

it('should clear the cookie after signing out', async () => {
  const res = await run()
  expect(res.get('Set-Cookie')).toBeDefined()
})
