import faker from 'faker';
import { TicketCreatedEvent } from "@brooksbenson03-tickets/common"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedListener } from "../ticket-created-listener"
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client)

  const data: TicketCreatedEvent['data'] = {
    version: faker.random.number(),
    id: new mongoose.Types.ObjectId().toHexString(),
    title: faker.random.word(),
    price: faker.random.number(),
    userId: new mongoose.Types.ObjectId().toHexString()
  }  
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg }
}

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  const ticket = await Ticket.findById(data.id)
  expect(ticket).toBeDefined()
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})