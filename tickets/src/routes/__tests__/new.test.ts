import request from 'supertest'
import faker from 'faker'
import { app } from '../../app'
import { Ticket } from '../../models/Ticket'

let cookie: string, title: string, price: number

beforeEach(() => {
  cookie = global.getCookie()
  title = faker.random.word()
  price = 10.0
})

const run = async () => {
  return await request(app)
    .post('/api/tickets')
    .set('Cookie', [cookie])
    .send({ title, price })
}

it('should not return a 404', async () => {
  const res = await run()
  expect(res).not.toHaveProperty('status', 404)
})

it('should return 401 when user is not signed in', async () => {
  cookie = ''
  const res = await run()
  expect(res).toHaveProperty('status', 401)
})

it('should not return a 401 when the user is signed in', async () => {
  const res = await run()
  expect(res).not.toHaveProperty('status', 401)
})

it('should return 400 on invalid title', async () => {
  title = ''
  const res = await run()
  expect(res).toHaveProperty('status', 400)
})

it('should return 400 on invalid price', async () => {
  price = 0
  const res = await run()
  expect(res).toHaveProperty('status', 400)
})

it('should return 201 on valid inputs', async () => {
  const res = await run()
  expect(res).toHaveProperty('status', 201)
})

it('should save a record to the database on valid inputs', async () => {
  await run()
  const ticket = await Ticket.findOne({ title, price })
  expect(ticket).toBeTruthy()
})
