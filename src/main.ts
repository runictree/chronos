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
  requestId: number

  constructor(host: string, port: number, timeout: number) {
    this.host = host
    this.port = port
    this.timeout = timeout
    this.socket = new Socket()
    this.socket.setTimeout(timeout)

    this.sessionId = 0
    this.requestId = 0
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

    const reply = data.readUInt16LE(0)

    if (reply !== replyCode.CMD_ACK_OK) {
      throw new SocketError('INVALID_REPLY_CODE')
    }

    return true
  }

  async close () : Promise<boolean> {
    const data = await this.execute(commandCode.CMD_CONNECT)

    const reply = data.readUInt16LE(0)

    if (reply !== replyCode.CMD_ACK_OK) {
      throw new SocketError('INVALID_REPLY_CODE')
    }

    return true
  }

  execute (command : number, data? : string) : Promise<Buffer> {
    return new Promise((resolve, reject) => {
      if (this.sessionId) {
        this.requestId++
      } else {
        this.sessionId = 0
        this.requestId = 0
      }

      const header = tcp.createHeader(command, this.sessionId, this.requestId, data)

      this.socket.on('data', (data) => {
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

  async enable () : Promise<boolean> {
    const data = await this.execute(commandCode.CMD_CONNECT)

    const reply = data.readUInt16LE(0)

    if (reply !== replyCode.CMD_ACK_OK) {
      throw new SocketError('INVALID_REPLY_CODE')
    }

    return true
  }

  async disable () : Promise<boolean> {
    const data = await this.execute(commandCode.CMD_DISABLEDEVICE)

    const reply = data.readUInt16LE(0)

    if (reply !== replyCode.CMD_ACK_OK) {
      throw new SocketError('INVALID_REPLY_CODE')
    }

    return true
  }

  async capacities () : Promise<Object> {
    const data = await this.execute(commandCode.CMD_GET_FREE_SIZES)

    console.log('capacity', data, data.length + ' bytes in total')

    const content = tcp.removeHeader(data)

    return {
      fingerprint: {
        capacity: content.readIntLE(68, 4),
        remaining: content.readIntLE(76, 4),
        used: content.readIntLE(32, 4)
      },
      record: {
        capacity: content.readIntLE(72, 4),
        remaining: content.readIntLE(84, 4),
        used: content.readIntLE(40, 4)
      },
      user: {
        capacity: content.readIntLE(64, 4),
        remaining: content.readIntLE(80, 4),
        used: content.readIntLE(24, 4),
        admin: content.readIntLE(56, 4),
        password: content.readIntLE(60, 4)
      },
      unknown: content.readIntLE(48, 4)
    }
  }
}
