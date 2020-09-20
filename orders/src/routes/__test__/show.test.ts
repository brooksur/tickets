import request from 'supertest';
import faker from 'faker';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

it('fetches the order', async () => {
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: faker.random.word(),
    price: faker.random.number()
  }).save()

  const user = global.getCookie()
  const { body: order } = await request(app).post('/api/orders').set('Cookie', user).send({ ticketId: ticket.id}).expect(201)
  const { body: fetchedOrder } = await request(app).get(`/api/orders/${order.id}`).set('Cookie', user).expect(200)
  expect(fetchedOrder.id).toEqual(order.id)
})

it('returns an error if one user tries to fetch another users order', async () => {
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: faker.random.word(),
    price: faker.random.number()
  }).save()

  const { body: order } = await request(app).post('/api/orders').set('Cookie', global.getCookie()).send({ ticketId: ticket.id}).expect(201)
  await request(app).get(`/api/orders/${order.id}`).set('Cookie', global.getCookie()).expect(401)
})