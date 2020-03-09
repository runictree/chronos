import { Socket } from 'net'
import { SocketError } from './SocketError'
import * as tcp from './helpers/tcp'
import * as utils from './helpers/utilities'
import { CommandCodes, ReplyCodes, RequestCodes } from './protocol'
import { User } from './User'
import { Record } from './Record'

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

      let content = Buffer.from([])
      let contentSize = 0
      let buffer = Buffer.from([])
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
          buffer = buffer.length > 0 ? Buffer.concat([ buffer, tcp.getContent(data) ]) : data
        } else {
          buffer = Buffer.concat([ buffer, data ])
        }

        const metadata = tcp.getMetadata(buffer)

        // when data come with proper header
        if (metadata.contentSize > 0) {
          if (buffer.length < metadata.size) {
            return
          }

          content = Buffer.concat([ content, buffer.subarray(tcp.HEADER_SIZE, metadata.size) ])

          const next = buffer.subarray(metadata.size)
          buffer = Buffer.from([])

          if (next.length > 0) {
            dataCallback(next)
          }

          return
        }

        // in some case the device will send first CMD_DATA without content and metadata.contentSize is 0
        // after that, it will continue send content without header
        // in this case, need to compare with contentSize that send with CMD_PREPARE_DATA
        const packageSize = contentSize + tcp.HEADER_SIZE

        if (buffer.length >= packageSize) {
          content = Buffer.concat([ content, buffer.subarray(tcp.HEADER_SIZE, packageSize) ])

          const next = buffer.subarray(packageSize)
          buffer = Buffer.from([])

          if (content.length === contentSize && next.length >= tcp.HEADER_SIZE) {
            // retrive all content but buffer has extra attach data
            // as I do not sure what it is, but the tail is valid header, so I grab it
            const tail = next.subarray(next.length - tcp.HEADER_SIZE)

            dataCallback(tail)

            return
          }

          if (next.length > 0) {
            dataCallback(next)
          }

          return
        }

        // for sake of safety
        // when the device mix proper header and without header together
        const wantMore = contentSize - content.length
        const wantMoreWithHeader = tcp.HEADER_SIZE + wantMore

        if (buffer.length >= wantMoreWithHeader) {
          content = Buffer.concat([ content, buffer.subarray(tcp.HEADER_SIZE, wantMoreWithHeader) ])

          const next = buffer.subarray(wantMoreWithHeader)
          buffer = Buffer.from([])

          if (next.length > 0) {
            dataCallback(next)
          }
        }
      }

      const manage = (data: Buffer) => {
        const index = data.indexOf(Buffer.from([ 0x50, 0x50, 0x82, 0x7d ]))

        if (index > 0) {
          concentrate(data.subarray(0, index))
          dataCallback(data.subarray(index))
        } else {
          concentrate(data)
        }
      }

      const dataCallback = (data: Buffer) => {
        timeoutWatcherSetup()

        if (!tcp.isValidHeader(data)) {
          manage(data)
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

            if (content.length > 0) {
              resolve(content)
            } else {
              resolve(data)
            }

            break

          case ReplyCodes.CMD_PREPARE_DATA:
            // prepare reply code, initalize some variables before retrieve data
            contentSize = data.readUInt32LE(16)

            break

          case ReplyCodes.CMD_DATA:
            if (data.length === metadata.size) {
              resolve(data)
              break
            }

            manage(data)
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
      case ReplyCodes.CMD_DATA:
        // small data size, device will return immediately
        return tcp.getContent(data)

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

  async getTime () : Promise<string> {
    const data = await this.execute(CommandCodes.CMD_GET_TIME)

    tcp.isOk(data)

    return utils.timeToDate(tcp.getContent(data).readUInt32LE(0))
  }

  async getUsers () : Promise<Array<User>> {
    const content = await this.run(CommandCodes.CMD_DATA_WRRQ, RequestCodes.REQ_USERS)
    const contentSize = content.readUInt32LE(0)
    const contentLength = content.length

    if (contentSize !== contentLength - 4) {
      throw new SocketError('UNMATCH_CONTENT_SIZE', { expected: contentSize, got: contentLength - 4 })
    }

    const users : Array<User> = []

    const USER_DATA_SIZE = 72
    const OFFSET = 4

    let start = OFFSET
    let end = start + USER_DATA_SIZE

    while (end <= contentLength) {
      const sample = content.subarray(start, end)
      const user = utils.decodeUserData(sample)
      users.push(user)

      start = end
      end += USER_DATA_SIZE
    }

    return users
  }

  async getRecords () : Promise<Array<Record>> {
    const content = await this.run(CommandCodes.CMD_DATA_WRRQ, RequestCodes.REQ_ATT_RECORDS)
    const contentSize = content.readUInt32LE(0)
    const contentLength = content.length

    if (contentSize !== contentLength - 4) {
      throw new SocketError('UNMATCH_CONTENT_SIZE', { expected: contentSize, got: contentLength - 4 })
    }

    const records : Array<Record> = []

    const RECORD_DATA_SIZE = 40
    const OFFSET = 4

    let start = OFFSET
    let end = start + RECORD_DATA_SIZE

    while (end <= contentLength) {
      const sample = content.subarray(start, end)
      const record = utils.decodeRecordData(sample)
      records.push(record)

      start = end
      end += RECORD_DATA_SIZE
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

  async testVoice () : Promise<boolean> {
    const data = await this.execute(CommandCodes.CMD_TESTVOICE)

    return tcp.isOk(data)
  }

  async isFingerScannerExist () : Promise<boolean> {
    const data = await this.execute(CommandCodes.CMD_TEST_TEMP)

    return tcp.isOk(data)
  }
}
