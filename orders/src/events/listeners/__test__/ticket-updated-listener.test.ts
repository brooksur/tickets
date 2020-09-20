import faker from 'faker';
import { TicketUpdatedEvent } from "@brooksbenson03-tickets/common"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedListener } from "../ticket-updated-listener"
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client)

  const ticket = await Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: faker.random.word(),
    price: faker.random.number(),
  }).save()

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: faker.random.word(),
    price: faker.random.number(),
    userId: new mongoose.Types.ObjectId().toHexString()
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, ticket }
}

it('finds, updates, and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup()
  await listener.onMessage(data, msg)
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket).toHaveProperty('title', data.title)
  expect(updatedTicket).toHaveProperty('price', data.price)
  expect(updatedTicket).toHaveProperty('version', data.version)
})

it('acks the message', async () => {
  const { listener, data, msg, ticket } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if the event has a skipped version', async () => {
  const { msg, data, listener, ticket } = await setup()
  
  data.version = 10

  try {
    await listener.onMessage(data, msg)
  } catch (e) {
  }

  expect(msg.ack).not.toHaveBeenCalled()
})