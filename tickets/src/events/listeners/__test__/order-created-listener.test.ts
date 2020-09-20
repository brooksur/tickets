import faker from 'faker';
import mongoose from 'mongoose';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/Ticket';
import { OrderCreatedEvent, OrderStatus } from '@brooksbenson03-tickets/common';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client)
  const ticket = await Ticket.build({
    title: faker.random.word(),
    price: faker.random.number(),
    userId: new mongoose.Types.ObjectId().toHexString()
  }).save()
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    expiresAt: new Date().toISOString(),
    version: 0,
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }
  return { listener, ticket, data, msg }
}

it('sets orderId on ticket', async () => {
  const { listener, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket).toHaveProperty('orderId', data.id)
})

it('acks the message', async () => {
  const { listener, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})

it('publishes a ticket:updated event', async () => {
  const { listener, data, ticket, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})