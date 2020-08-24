import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import faker from 'faker'
import jwt from 'jsonwebtoken'

declare global {
  namespace NodeJS {
    interface Global {
      getCookie(id?: string): string
    }
  }
}

let mongo: any
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf'
  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()

  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.getCookie = (id = new mongoose.Types.ObjectId().toHexString()) => {
  const payload = {
    id,
    email: faker.internet.email()
  }

  const session = JSON.stringify({
    jwt: jwt.sign(payload, process.env.JWT_KEY!)
  })

  const base64 = Buffer.from(session).toString('base64')

  return `express:sess=${base64}`
}
