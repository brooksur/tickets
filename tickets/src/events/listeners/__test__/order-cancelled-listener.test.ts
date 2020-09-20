import { OrderCancelledEvent } from '@brooksbenson03-tickets/common';
import faker from 'faker';
import mongoose from 'mongoose'
import { Ticket } from "../../../models/Ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client)
  const orderId = new mongoose.Types.ObjectId().toHexString()
  const ticket = await Ticket.build({
    title: faker.random.word(),
    price: faker.random.number(),
    userId: new mongoose.Types.ObjectId().toHexString()
  })
  ticket.set({ orderId })
  await ticket.save()
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id
    }
  }
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }
  return { listener, ticket, data, msg }
}

it('updates the ticket, publishes an event, and acks the message', async () => {
  const { listener, ticket, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket).toHaveProperty('orderId', undefined)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
  expect(msg.ack).toHaveBeenCalled()
})