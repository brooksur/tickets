import request from 'supertest';
import faker from 'faker'
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: faker.random.word(),
    price: faker.random.number()
  })

  await ticket.save()
  return ticket
}

it('should return orders for the authenticated user', async () => {
  const [one, two, three] = [await buildTicket(), await buildTicket(), await buildTicket()]
  const [userOne, userTwo] = [global.getCookie(), global.getCookie()]
  await request(app).post('/api/orders').set('Cookie', userOne).send({ ticketId: one.id })
  const { body: orderOne} = await request(app).post('/api/orders').set('Cookie', userTwo).send({ ticketId: two.id })
  const { body: orderTwo } = await request(app).post('/api/orders').set('Cookie', userTwo).send({ ticketId: three.id })
  const res = await request(app).get('/api/orders').set('Cookie', userTwo).expect(200)
  expect(res.body).toHaveLength(2)
  expect(res.body[0].id).toEqual(orderOne.id)
  expect(res.body[1].id).toEqual(orderTwo.id)
})
