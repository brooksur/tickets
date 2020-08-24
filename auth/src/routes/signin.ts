import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { validateRequest, BadRequestError } from '@bb-tickets/common'
import { User } from '../models/User'
import { Password } from '../services/Password'

const router = express.Router()

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must apply a password')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const matchedUser = await User.findOne({ email })

    if (!matchedUser) {
      throw new BadRequestError('Invalid credentials')
    }

    const matchedPasswords = await Password.compare(
      matchedUser.password,
      password
    )

    if (!matchedPasswords) {
      throw new BadRequestError('Invalid credentials')
    }

    const userJwt = jwt.sign(
      {
        id: matchedUser.id,
        email: matchedUser.email
      },
      process.env.JWT_KEY!
    )

    req.session = { jwt: userJwt }

    res.send(matchedUser)
  }
)

export { router as signinRouter }
