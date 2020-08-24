import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

const scryptProm = promisify(scrypt)

export class Password {
  static async hash(pass: string, salt: string) {
    const hash = (await scryptProm(pass, salt, 64)) as Buffer
    return hash.toString('hex')
  }

  static async hashAndSalt(pass: string) {
    const salt = randomBytes(8).toString('hex')
    const hash = await Password.hash(pass, salt)
    return `${hash}.${salt}`
  }

  static async compare(storedPass: string, suppliedPass: string) {
    const [hash, salt] = storedPass.split('.')
    return hash === (await Password.hash(suppliedPass, salt))
  }
}
