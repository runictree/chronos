import { errors } from './helpers/errors'

export class SocketError extends Error {
  public readonly code: string
  public readonly message: string
  public readonly params: any

  constructor (code: string, params?: any) {
    let message = errors[code] ? `${code}: ${errors[code]}` : `UNKNOWN_ERROR: ${code}`

    super(message)

    Object.setPrototypeOf(this, new.target.prototype)

    if (errors[code]) {
      this.code = code
      this.message = errors[code]
    } else {
      this.code = 'UNKNOWN_ERROR'
      this.message = code
    }

    this.params = params

    Error.captureStackTrace(this)
  }
}
