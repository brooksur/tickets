import request from 'supertest'
import faker from 'faker'
import { app } from '../../app'
import { Ticket } from '../../models/Ticket'

let resources: any

beforeEach(async () => {
  resources = await Promise.all([
    Ticket.build({
      userId: faker.random.uuid(),
      title: faker.random.word(),
      price: faker.random.number()
    }).save(),
    Ticket.build({
      userId: faker.random.uuid(),
      title: faker.random.word(),
      price: faker.random.number()
    }).save()
  ])
})

const run = async () =>
  await request(app).get('/api/tickets').set('Cookie', [global.getCookie()])

it('should return 200', async () => {
  const res = await run()
  expect(res.status).toBe(200)
})

it('should return resources', async () => {
  const res = await run()
  expect(res.body).toHaveLength(resources.length)
})
