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
        this.socket.removeAllListeners()
        reject(new SocketError(error.code || error.message))
      }

      this.socket.on('error', errorCallback)

      this.socket.once('connect', () => {
        this.socket.removeAllListeners()
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
        this.socket.removeAllListeners()
        reject(new SocketError(error.code || error.message))
      }

      if (this.isConnected()) {
        this.socket.on('error', errorCallback)

        this.socket.end(() => {
          this.socket.removeAllListeners()
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

    const metadata = tcp.getMetadata(data)

    this.sessionId = metadata.sessionId

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
    const data = await this.execute(CommandCodes.CMD_EXIT)

    return tcp.isOk(data)
  }

  put (command: number, params? : Buffer) {
    const header = tcp.createHeader(command, this.sessionId, this.requestId, params)
    this.socket.write(header)
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

      const payload : Buffer[] = []
      let buffer = Buffer.from([])
      let payloadSize = 0
      let timeoutWatcher : NodeJS.Timeout | undefined = undefined

      const timeoutWatcherSetup = () => {
        if (timeoutWatcher) {
          clearTimeout(timeoutWatcher)
        }

        timeoutWatcher = setTimeout(() => {
          this.socket.removeAllListeners()
          reject(new SocketError('EXEC_TIMEDOUT', this.timeout))
        }, this.timeout)
      }

      const concentrate = (data: Buffer) => {
        if (tcp.isValidHeader(data)) {
          if (buffer.length <= 0) {
            buffer = data
          } else {
            buffer = Buffer.concat([ buffer, tcp.getContent(data) ])
          }
        } else {
          buffer = Buffer.concat([ buffer, data ])
        }

        const packageSize = payloadSize + tcp.HEADER_SIZE

        if (buffer.length >= packageSize) {
          payload.push(buffer.subarray(0, packageSize))

          const next = buffer.subarray(packageSize)
          buffer = Buffer.from([])

          dataCallback(next)
        }
      }

      const dataCallback = (data: Buffer) => {
        timeoutWatcherSetup()

        if (!tcp.isValidHeader(data)) {
          concentrate(data)
          return
        }

        const metadata = tcp.getMetadata(data)

        let error : SocketError | null = null

        switch (metadata.replyCode) {
          case ReplyCodes.CMD_ACK_OK:
            this.socket.removeAllListeners()

            if (timeoutWatcher) {
              clearTimeout(timeoutWatcher)
            }

            if (payload.length <= 0) {
              resolve(data)
            } else {
              resolve(Buffer.concat(payload))
            }

            break

          case ReplyCodes.CMD_PREPARE_DATA:
            // prepare reply code, initalize some variables before retrieve data
            payloadSize = data.readUInt32LE(16)

            break

          case ReplyCodes.CMD_DATA:
            concentrate(data)
            break

          case ReplyCodes.CMD_ACK_UNAUTH:
            error = new SocketError('UNAUTHORIZED')
            break

          case ReplyCodes.CMD_ACK_UNKNOWN:
            error = new SocketError('UNKNOWN_COMMAND')
            break

          case ReplyCodes.CMD_ACK_ERROR:
            error = new SocketError('PROCESSING_ERROR')
            break

          default:
            error = new SocketError('INVALID_REPLY_CODE', metadata.replyCode)
            break
        }

        if (error) {
          this.socket.removeAllListeners()
          reject(error)
        }
      }

      this.socket.on('data', dataCallback)

      const errorCallback = (error: NodeJS.ErrnoException) => {
        this.socket.removeAllListeners()

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

    const metadata = tcp.getMetadata(data)

    switch (metadata.replyCode) {
      case ReplyCodes.CMD_ACK_DATA:
        // small size data, device will return immediately and ready to use
        return data

      case ReplyCodes.CMD_ACK_OK:
        // large size data, only header is returned
        // size can get from data.readUInt32LE(HEADER_SIZE+1) and data.readUInt32LE(HEADER_SIZE+5)
        // but it do not make sense to has same value in 2 places...
        const size = data.readUInt32LE(tcp.HEADER_SIZE + 1)

        if (size !== data.readUInt32LE(tcp.HEADER_SIZE + 5)) {
          // so this should not happen
          throw new SocketError('SIZE_MISMATCH', { 'h+1': size, 'h+5': data.readUInt32LE(tcp.HEADER_SIZE + 5) })
        }

        const requestParams = Buffer.alloc(tcp.METADATA_SIZE)
        requestParams.writeUInt32LE(0, 0)
        requestParams.writeUInt32LE(size, 4)

        const resp = await this.execute(CommandCodes.CMD_DATA_RDY, requestParams)

        return resp

      default:
        throw new SocketError('INVALID_REPLY_CODE', metadata.replyCode)
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

    const content = tcp.getContent(data)

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

  async firmwareVersion () : Promise<string> {
    const data = await this.execute(CommandCodes.CMD_GET_VERSION)

    tcp.isOk(data)

    return tcp.getContent(data).toString()
  }

  async getTime () : Promise<Date> {
    const data = await this.execute(CommandCodes.CMD_GET_TIME)

    tcp.isOk(data)

    return utils.timeToDate(tcp.getContent(data).readUInt32LE(0))
  }

  async getUsers () : Promise<Array<User>> {
    const data = await this.run(CommandCodes.CMD_DATA_WRRQ, RequestCodes.REQ_USERS)
    const content = tcp.getContent(data)
    const contentSize = content.readUInt32LE(0)

    if (contentSize !== content.length - 4) {
      throw new SocketError('UNMATCH_CONTENT_SIZE', { contentSize, contentLength: content.length - 4 })
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

  async getAttendanceRecords () : Promise<Array<AttendanceRecord>> {
    const data = await this.run(CommandCodes.CMD_DATA_WRRQ, RequestCodes.REQ_ATT_RECORDS)
    const content = tcp.getContent(data)
    const contentSize = content.readUInt32LE(0)

    if (contentSize !== content.length - 4) {
      throw new SocketError('UNMATCH_CONTENT_SIZE', { contentSize, contentLength: content.length - 4 })
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

  async restart () : Promise<boolean> {
    this.put(CommandCodes.CMD_RESTART)

    const data = await this.execute(CommandCodes.CMD_EXIT)

    return tcp.isOk(data)
  }

  async sleep () : Promise<boolean> {
    const data = await this.execute(CommandCodes.CMD_SLEEP)

    return tcp.isOk(data)
  }

  async resume () : Promise<boolean> {
    const data = await this.execute(CommandCodes.CMD_RESUME)

    return tcp.isOk(data)
  }

  async shutdown () : Promise<boolean> {
    this.put(CommandCodes.CMD_POWEROFF)

    const data = await this.execute(CommandCodes.CMD_EXIT)

    return tcp.isOk(data)
  }

  async testvoice () : Promise<boolean> {
    const data = await this.execute(CommandCodes.CMD_TESTVOICE)

    return tcp.isOk(data)
  }
}
