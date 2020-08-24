import { Router, Request, Response } from 'express'
import { body } from 'express-validator'
import { requireAuth, validateRequest } from '@bb-tickets/common'
import { Ticket } from '../models/Ticket'

const router = Router()

router.post(
  '/api/tickets',
  [
    requireAuth,
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greated than 0'),
    validateRequest
  ],
  async (req: Request, res: Response) => {
    const { title, price } = req.body
    const { id: userId } = req.currentUser!
    const ticket = await Ticket.build({ title, price, userId }).save()
    res.status(201).send(ticket)
  }
)

export { router as createTicketRouter }
