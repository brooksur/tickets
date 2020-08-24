import request from 'supertest'
import faker from 'faker'
import mongoose from 'mongoose'
import { app } from '../../app'
import { Ticket } from '../../models/Ticket'

let resource: any, resourceId: string

beforeEach(async () => {
  resource = await Ticket.build({
    userId: faker.random.uuid(),
    title: faker.random.word(),
    price: faker.random.number()
  }).save()
  resourceId = resource._id.toString()
})

const run = async () =>
  await request(app)
    .get(`/api/tickets/${resourceId}`)
    .set('Cookie', [global.getCookie()])

it('should return 404 on invalid request', async () => {
  resourceId = new mongoose.Types.ObjectId().toHexString()
  const res = await run()
  expect(res.status).toBe(404)
})

it('should return 200 on valid request', async () => {
  const res = await run()
  expect(res.status).toBe(200)
})

it('should return resource on valid request', async () => {
  const { id, userId, title, price } = resource
  const res = await run()
  expect(res.body).toMatchObject({
    id,
    userId,
    title,
    price
  })
})
