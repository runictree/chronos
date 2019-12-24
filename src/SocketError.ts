export class SocketError extends Error {
  public readonly code: string
  public readonly message: string

  constructor (code: string, message: string) {
    super(message)

    Object.setPrototypeOf(this, new.target.prototype)

    this.code = code
    this.message = message

    Error.captureStackTrace(this)
  }
}
