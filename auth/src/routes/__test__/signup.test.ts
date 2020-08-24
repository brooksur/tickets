import request from 'supertest'
import faker from 'faker'
import { app } from '../../app'

interface Body {
  email: string
  password: string
}

let body: Body

beforeEach(() => {
  body = {
    email: faker.internet.email(),
    password: faker.internet.password(8)
  }
})

const run = () => request(app).post('/api/users/signup').send(body)

// invalid

it('should return 400 on invalid email', () => {
  body.email = faker.random.word()
  return run().expect(400)
})

it('should return 400 on invalid password', async () => {
  body.password = faker.internet.password(3)
  await run().expect(400)
  body.password = faker.internet.password(21)
  return run().expect(400)
})

it('should return 400 on missing email', () => {
  delete body.email
  return run().expect(400)
})

it('should return 400 on missing password', () => {
  delete body.password
  return run().expect(400)
})

it('should return 400 on duplicate email', async () => {
  await run()
  return run().expect(400)
})

// valid

it('should return a 201 on valid request', () => {
  return run().expect(201)
})

it('should set a cookie on valid request', async () => {
  const res = await run()
  expect(res.get('Set-Cookie')).toBeDefined()
})

it('should return valid user object on valid request', async () => {
  const res = await run()
  expect(res.body).toHaveProperty('id')
  expect(res.body).toHaveProperty('email')
  expect(res.body).not.toHaveProperty('password')
})
