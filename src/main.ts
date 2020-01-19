import { Socket } from 'net'
import { SocketError } from './SocketError'
import * as tcp from './helpers/tcp'
import * as utils from './helpers/utilities'
import { CommandCodes, ReplyCodes, RequestCodes } from './protocol'
import { User } from './User'
import { AttendanceRecord } from './AttendanceRecord'

export class TimeAttendance {
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

    this.sessionId = 0
    this.requestId = 0
  }

  connect () : Promise<boolean> {
    return new Promise((resolve, reject) => {
      const errorCallback = (error: NodeJS.ErrnoException) => {
        this.socket.removeListener('error', errorCallback)
        reject(new SocketError(error.code || error.message))
      }

      this.socket.on('error', errorCallback)

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
      const errorCallback = (error: NodeJS.ErrnoException) => {
        this.socket.removeListener('error', errorCallback)
        reject(new SocketError(error.code || error.message))
      }

      if (this.isConnected()) {
        this.socket.on('error', errorCallback)

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
    const data = await this.execute(CommandCodes.CMD_CONNECT)

    tcp.isOk(data)

    const header = tcp.decodeHeader(data)

    this.sessionId = header.sessionId

    if (!this.sessionId) {
      throw new SocketError('NO_SESSION')
    }

    return true
  }

  async clearBuffer () : Promise<boolean> {
    const data = await this.execute(CommandCodes.CMD_FREE_DATA)

    return tcp.isOk(data)
  }

  async close () : Promise<boolean> {
    const data = await this.execute(CommandCodes.CMD_CONNECT)

    return tcp.isOk(data)
  }

  execute (command : number, params? : Buffer) : Promise<Buffer> {
    return new Promise((resolve, reject) => {
      if (this.sessionId) {
        this.requestId++
      } else {
        this.sessionId = 0
        this.requestId = 0
      }

      const header = tcp.createHeader(command, this.sessionId, this.requestId, params)

      let response = Buffer.from([])
      let buffer = Buffer.from([])
      let timeoutWatcher : NodeJS.Timeout | undefined = undefined

      const timeoutWatcherSetup = () => {
        if (timeoutWatcher) {
          clearTimeout(timeoutWatcher)
        }

        timeoutWatcher = setTimeout(() => {
          reject(new SocketError('EXEC_TIMEDOUT', this.timeout))
        }, this.timeout)
      }

      const concentrate = (data: Buffer) => {
        buffer = Buffer.concat([ buffer, data ])

        const size = buffer.readUInt16LE(4)

        if (buffer.length >= 8 + size) {
          response = Buffer.concat([ response, buffer.subarray(16, 8 + size) ])
          buffer = buffer.subarray(8 + size)
        }
      }

      const dataCallback = (data: Buffer) => {
        timeoutWatcherSetup()

        if (tcp.isValidHeader(data, this.requestId + 1)) {
          const header = tcp.decodeHeader(data)

          switch (header.replyCode) {
            case ReplyCodes.CMD_ACK_OK:
              this.socket.removeListener('data', dataCallback)

              if (timeoutWatcher) {
                clearTimeout(timeoutWatcher)
              }

              if (response.length <= 0) {
                resolve(data)
              } else {
                resolve(Buffer.concat([ data, response ]))
              }

              break

            case ReplyCodes.CMD_PREPARE_DATA:
              // prepare reply code, initalize some variables before retrieve data
              break

            case ReplyCodes.CMD_DATA:
              concentrate(data)
              break

            case ReplyCodes.CMD_ACK_UNAUTH:
              reject(new SocketError('UNAUTHORIZED'))

            default:
              reject(new SocketError('INVALID_REPLY_CODE', header.replyCode))
              break
          }

          return
        }

        concentrate(data)
      }

      this.socket.on('data', dataCallback)

      const errorCallback = (error: NodeJS.ErrnoException) => {
        this.socket.removeListener('error', errorCallback)

        if (timeoutWatcher) {
          clearTimeout(timeoutWatcher)
        }

        reject(new SocketError(error.code || error.message))
      }

      this.socket.on('error', errorCallback)

      timeoutWatcherSetup()

      this.socket.write(header)
    })
  }

  async run (command : number, params? : Buffer) : Promise<Buffer> {
    const data = await this.execute(command, params)
    const header = tcp.decodeHeader(data)

    switch (header.replyCode) {
      case ReplyCodes.CMD_ACK_DATA:
        // small size data, device will return immediately and ready to use
        return data

      case ReplyCodes.CMD_ACK_OK:
        // large size data, only header is returned
        // size can get from data.readUInt32LE(16+1) and data.readUInt32LE(16+5)
        // but it do not make sense to has same value in 2 places...
        const size = data.readUInt32LE(17)

        if (size !== data.readUInt32LE(21)) {
          throw new SocketError('SIZE_MISMATCH', { '17': size, '21': data.readUInt32LE(21) })
        }

        const requestParams = Buffer.alloc(8)
        requestParams.writeUInt32LE(0, 0)
        requestParams.writeUInt32LE(size, 4)

        const resp = await this.execute(CommandCodes.CMD_DATA_RDY, requestParams)

        return resp

      default:
        throw new SocketError('INVALID_REPLY_CODE', header.replyCode)
    }
  }

  async enable () : Promise<boolean> {
    const data = await this.execute(CommandCodes.CMD_CONNECT)

    return tcp.isOk(data)
  }

  async disable () : Promise<boolean> {
    const data = await this.execute(CommandCodes.CMD_DISABLEDEVICE)

    return tcp.isOk(data)
  }

  async capacities () : Promise<Object> {
    const data = await this.execute(CommandCodes.CMD_GET_FREE_SIZES)

    tcp.isOk(data)

    const content = tcp.removeHeader(data)

    return {
      fingerprint: {
        capacity: content.readUInt32LE(60),
        remaining: content.readUInt32LE(68),
        used: content.readUInt32LE(24)
      },
      record: {
        capacity: content.readUInt32LE(64),
        remaining: content.readUInt32LE(76),
        used: content.readUInt32LE(32)
      },
      user: {
        capacity: content.readUInt32LE(56),
        remaining: content.readUInt32LE(72),
        used: content.readUInt32LE(16),
        admin: content.readUInt32LE(48),
        password: content.readUInt32LE(52)
      },
      unknown: content.readUInt32LE(40)
    }
  }

  async users () : Promise<Array<User>> {
    const data = await this.run(CommandCodes.CMD_DATA_WRRQ, RequestCodes.REQ_USERS)
    const content = tcp.removeHeader(data)

    const contentSize = content.readUInt32LE(0)
    if (contentSize !== content.length - 4) {
      throw new SocketError('UNMATCH_CONTENT_SIZE')
    }

    const users : Array<User> = []
    const size = content.length
    const USER_DATA_SIZE = 72

    let offset = 4
    let end = offset + USER_DATA_SIZE

    while (end <= size) {
      const sample = content.subarray(offset, end)
      const user = utils.decodeUserData(sample)
      users.push(user)

      offset += USER_DATA_SIZE
      end = offset + USER_DATA_SIZE
    }

    return users
  }

  async attendanceRecords () : Promise<Array<AttendanceRecord>> {
    const data = await this.run(CommandCodes.CMD_DATA_WRRQ, RequestCodes.REQ_ATT_RECORDS)
    const content = tcp.removeHeader(data)

    const contentSize = content.readUInt32LE(0)

    if (contentSize !== content.length - 4) {
      throw new SocketError('UNMATCH_CONTENT_SIZE')
    }

    const records : Array<AttendanceRecord> = []
    const size = content.length
    const RECORD_DATA_SIZE = 40

    let offset = 4
    let end = offset + RECORD_DATA_SIZE

    while (end <= size) {
      const sample = content.subarray(offset, end)
      const record = utils.decodeRecordData(sample)
      records.push(record)

      offset += RECORD_DATA_SIZE
      end = offset + RECORD_DATA_SIZE
    }

    return records
  }
}
