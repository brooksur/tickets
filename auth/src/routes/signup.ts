import express, { Request, Response } from 'express'
import { User } from '../models/User'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { validateRequest, BadRequestError } from '@bb-tickets/common'

const router = express.Router()

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (await User.findOne({ email })) {
      throw new BadRequestError('Email already in use')
    }

    const user = await User.create({ email, password })

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_KEY!
    )

    req.session = { jwt: userJwt }

    res.status(201).send(user)
  }
)

export { router as signupRouter }
