import request from 'supertest';
import faker from 'faker';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '../../models/order';

it.only('marks an order as cancelled', async () => {
   const ticket = await Ticket.build({
     title: faker.random.word(),
     price: faker.random.number()
   }).save()

   const user = global.getCookie()
   const { body: order } = await request(app).post('/api/orders').set('Cookie', user).send({ ticketId: ticket.id }).expect(201)
   await request(app).delete('/api/orders/' + order.id).set('Cookie', user).send().expect(204)
   const { body: updatedOrder } = await request(app).get(`/api/orders/${order.id}`).set('Cookie', user)
   expect(updatedOrder.status).toEqual(OrderStatus.Cancelled)
})