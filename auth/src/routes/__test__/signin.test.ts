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

const run = () => request(app).post('/api/users/signin').send(body)

it('should return 400 when email is not registered', () => {
  body.email = faker.internet.email()
  return run().expect(400)
})

it('should return 400 when incorrect password is supplied', () => {
  body.password = faker.internet.password(8)
  return run().expect(400)
})

it('should return a cookie when request is valid', async () => {
  const res = await run()
  expect(res.get('Set-Cookie')).toBeDefined()
})
