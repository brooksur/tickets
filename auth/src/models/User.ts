import mongoose from 'mongoose'
import { Password } from '../services/Password'

interface UserAttrs {
  email: string
  password: string
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc
}

interface UserDoc extends mongoose.Document {
  email: string
  password: string
}

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.password
      }
    }
  }
)

schema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const password = await Password.hashAndSalt(this.get('password'))
    this.set('password', password)
  }
  done()
})

schema.statics.create = async (attrs: UserAttrs) => {
  const user = new User(attrs)
  await user.save()
  return user
}

const User = mongoose.model<UserDoc, UserModel>('User', schema)

export { User }
