import { errors } from './helpers/errors'

export class SocketError extends Error {
  public readonly code: string
  public readonly message: string

  constructor (code: string) {
    const message = errors[code]

    super(message || code)

    Object.setPrototypeOf(this, new.target.prototype)

    this.code = message ? code : 'UNKNOWN'
    this.message = message

    Error.captureStackTrace(this)
  }
}
