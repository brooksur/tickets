import request from 'supertest';
import faker from 'faker';
import { app } from '../../app';
import { Ticket, TicketDoc } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';

let cookie: string, ticket: TicketDoc, ticketId: string

beforeEach(async () => {
  cookie = global.getCookie()
  const ticket = Ticket.build({
    title: faker.random.word(),
    price: faker.random.number()
  })
  await ticket.save()
  ticketId = ticket.id
})

const run = async () => 
  await request(app)
    .post('/api/orders')
    .set('Cookie', [cookie])
    .send({ ticketId })


it('should return 401 when sender is not authorized', async () => {
  cookie = faker.random.word()
  const res = await run()
  expect(res.status).toBe(401)
})

it('should return 400 when ticketId is invalid', async () => {
  ticketId = ''
  const res = await run()
  expect(res.status).toBe(400)
});

it('should return 404 when ticketId does not reference a ticket', async () => {
  ticketId = global.getObjectId()
  const res = await run()
  expect(res.status).toBe(404)
})

it('should return 400 when ticket is already reserved', async () => {
  const ticket: any = await Ticket.findOne({})
  const order = Order.build({
    userId: global.getObjectId(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket
  })
  await order.save()
  const res = await run()
  expect(res.status).toBe(400)
})

it('should return 201 when request is valid', async () => {
  const res = await run()
  expect(res.status).toBe(201)
})

it('should save order to database when request is valid', async () => {
  await run()
  const orders = await Order.find({ })
  expect(orders).toHaveLength(1)
})

