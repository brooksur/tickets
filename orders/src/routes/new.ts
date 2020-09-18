import { Request, Response, Router } from 'express';
import { requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError } from '@brooksbenson03-tickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const router = Router()

const EXPIRATION_WINDOW_SECONDS = 15 * 60

router.post('/api/orders', [
  requireAuth, 
  body('ticketId').not().isEmpty().withMessage('TicketId must be provided'),
  validateRequest
], async (req: Request, res: Response) => {
  const { ticketId } = req.body

  const ticket = await Ticket.findById(ticketId)
  if (!ticket) {
    throw new NotFoundError()
  }

  const isReserved = await ticket.isReserved()
  if (isReserved) {
    throw new BadRequestError('Ticket is reserved')
  }

   const expirationDate = new Date()
   expirationDate.setSeconds(expirationDate.getSeconds() + EXPIRATION_WINDOW_SECONDS)

   const order = Order.build({
     userId: req.currentUser!.id,
     status: OrderStatus.Created,
     expiresAt: expirationDate,
     ticket
   })
   await order.save()
   
   res.status(201).send(order)
})

export { router as newOrderRouter }