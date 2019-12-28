import { Socket } from 'net'
import { SocketError } from './SocketError'
import * as tcp from './helpers/tcp'
import { commandCode, replyCode } from './protocol'

export class Device {
  host: string
  port: number
  timeout: number
  socket: Socket
  sessionId: number
  replyId: number

  constructor(host: string, port: number, timeout: number) {
    this.host = host
    this.port = port
    this.timeout = timeout
    this.socket = new Socket()
    this.socket.setTimeout(timeout)

    this.sessionId = 0
    this.replyId = 0
  }

  connect () : Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.socket.on('error', err => {
        const msg = err.message.split(' ')
        reject(new SocketError(msg[1] || err.message))
      })

      this.socket.once('connect', () => {
        resolve(true)
      })

      this.socket.connect(this.port, this.host)
    })
  }

  isConnected () : boolean {
    return !!this.socket.remoteAddress
  }

  disconnect () : Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.isConnected()) {
        this.socket.on('error', (err) => {
          const msg = err.message.split(' ')
          reject(new SocketError(msg[1] || err.message))
        })

        this.socket.removeAllListeners()
        this.socket.end(() => {
          resolve(true)
        })
      } else {
        resolve(true)
      }
    })
  }

  async open () : Promise<boolean> {
    const data = await this.execute(commandCode.CMD_CONNECT)

    if (!data) {
      throw new SocketError('EXEC_FAILED')
    }

    const reply = data.readUInt16LE(0)

    if (reply !== replyCode.CMD_ACK_OK) {
      throw new SocketError('INVALID_REPLY_CODE')
    }

    this.sessionId = data.readUInt16LE(4)

    if (!this.sessionId) {
      throw new SocketError('NO_SESSION')
    }

    return true
  }

  async clearBuffer () : Promise<boolean> {
    const data = await this.execute(commandCode.CMD_FREE_DATA)

    if (!data) {
      throw new SocketError('EXEC_FAILED')
    }

    const reply = data.readUInt16LE(0)

    if (reply !== replyCode.CMD_ACK_OK) {
      throw new SocketError('INVALID_REPLY_CODE')
    }

    return true
  }

  async close () : Promise<boolean> {
    const data = await this.execute(commandCode.CMD_CONNECT)

    if (!data) {
      throw new SocketError('EXEC_FAILED')
    }

    const reply = data.readUInt16LE(0)

    if (reply !== replyCode.CMD_ACK_OK) {
      throw new SocketError('INVALID_REPLY_CODE')
    }

    return true
  }

  execute (command : number, data? : string) : Promise<Buffer | null> {
    return new Promise((resolve, reject) => {
      if (this.sessionId && this.replyId) {
        this.replyId++
      }

      const header = tcp.createHeader(command, this.sessionId, this.replyId, data || '')

      this.socket.once('data', (data) => {
        resolve(tcp.removeHeader(data))
      })

      this.socket.write(header, (err) => {
        if (err) {
          const msg = err.message.split(' ')
          reject(new SocketError(msg[1] || err.message))
        }
      })
    })
  }
}
