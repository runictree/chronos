import { Socket } from 'net'
import { SocketError } from './SocketError'

export class Device {
  host: string
  port: number
  timeout: number
  socket: Socket

  constructor(host: string, port: number, timeout: number) {
    this.host = host
    this.port = port
    this.timeout = timeout
    this.socket = new Socket()
    this.socket.setTimeout(timeout)
  }

  connect() : Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.socket.on('error', err => {
        const msg = err.message.split(' ')
        reject(new SocketError(msg[1] || 'ERR_UNKNOWN', err.message))
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
          reject(new SocketError(msg[1] || 'ERR_UNKNOWN', err.message))
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

  write (buffer: string | Uint8Array) : Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.socket.once('data', (data) => {
        resolve(data)
      })

      this.socket.write(buffer, (err) => {
        reject(err)
      })
    })
  }






}
