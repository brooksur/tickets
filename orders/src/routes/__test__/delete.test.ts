import request from 'supertest';
import faker from 'faker';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled', async () => {
   const ticket = await Ticket.build({
     id: new mongoose.Types.ObjectId().toHexString(),
     title: faker.random.word(),
     price: faker.random.number()
   }).save()

   const user = global.getCookie()
   const { body: order } = await request(app).post('/api/orders').set('Cookie', user).send({ ticketId: ticket.id }).expect(201)
   await request(app).delete('/api/orders/' + order.id).set('Cookie', user).send().expect(204)
   const { body: updatedOrder } = await request(app).get(`/api/orders/${order.id}`).set('Cookie', user)
   expect(updatedOrder.status).toEqual(OrderStatus.Cancelled)
})

it('should publish event when request is valid', async () => {
  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: faker.random.word(),
    price: faker.random.number()
  }).save()

  const user = global.getCookie()
  const { body: order } = await request(app).post('/api/orders').set('Cookie', user).send({ ticketId: ticket.id }).expect(201)
  await request(app).delete('/api/orders/' + order.id).set('Cookie', user).send().expect(204)
  await request(app).get(`/api/orders/${order.id}`).set('Cookie', user)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})