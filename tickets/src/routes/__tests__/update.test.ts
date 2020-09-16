import request from 'supertest'
import faker from 'faker'
import mongoose from 'mongoose'
import { app } from '../../app'
import { Ticket } from '../../models/Ticket'
import { natsWrapper } from '../../nats-wrapper';

let resource: any, resourceId: string, updates: any, cookie: string

beforeEach(async () => {
  resource = await Ticket.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    title: faker.random.word(),
    price: faker.random.number()
  }).save()
  resourceId = resource._id.toString()
  updates = {
    title: faker.random.word(),
    price: faker.random.number()
  }
  cookie = global.getCookie(resource.userId)
})

const run = async () =>
  await request(app)
    .put(`/api/tickets/${resourceId}`)
    .set('Cookie', [cookie])
    .send(updates)

it('returns a 404 when id param is invalid', async () => {
  resourceId = new mongoose.Types.ObjectId().toHexString()
  const res = await run()
  expect(res.status).toBe(404)
})

it('returns a 401 when user is not authenticated', async () => {
  cookie = faker.random.alphaNumeric()
  const res = await run()
  expect(res.status).toBe(401)
})

it('returns a 401 when user does not own the resource', async () => {
  cookie = global.getCookie()
  const res = await run()
  expect(res.status).toBe(401)
})

it('returns a 400 on invalid title', async () => {
  updates.title = ''
  const res = await run()
  expect(res.status).toBe(400)
})

it('returns a 400 on invalid price', async () => {
  updates.price = -1
  const res = await run()
  expect(res.status).toBe(400)
})

it('returns a 200 on valid body', async () => {
  const res = await run()
  expect(res.status).toBe(200)
})

it('returns updated resource on valid body', async () => {
  const res = await run()
  expect(res.body).toMatchObject(updates)
})

it('should publish event on valid inputs', async () => {
  await run()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
