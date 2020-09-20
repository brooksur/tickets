 import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  currentUser, BadRequestError
} from '@brooksbenson03-tickets/common'
import { Ticket } from '../models/Ticket'
import { natsWrapper } from '../nats-wrapper';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';

const router = Router()

router.put(
  '/api/tickets/:id',
  [
    currentUser,
    requireAuth,
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
    validateRequest
  ],
  async (req: Request, res: Response) => {
    const { id: ticketId } = req.params
    const { id: userId } = req.currentUser!
    const { title, price } = req.body
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) throw new NotFoundError()
    if (ticket.orderId) throw new BadRequestError('Ticket is reserved')
    if (userId !== ticket.userId) throw new NotAuthorizedError()
    ticket.set({ title, price })
    await ticket.save()
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version
    })
    return res.send(ticket)
  }
)

export { router as updateTicketRouter }
