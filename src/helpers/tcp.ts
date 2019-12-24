import { MAX_USHORT } from './constants'
import * as utils from './utilities'

export function createHeader (command: number, sessionId: number, replyId: number, data: string) : Buffer {
  const dataBuffer = Buffer.from(data)
  const buffer = Buffer.alloc(8 + dataBuffer.length)

  buffer.writeUInt16LE(command, 0)
  buffer.writeUInt16LE(0, 2)
  buffer.writeUInt16LE(sessionId, 4)
  buffer.writeUInt16LE(replyId, 6)

  dataBuffer.copy(buffer, 8)

  const checkSum = utils.createCheckSum(buffer)
  buffer.writeUInt16LE(checkSum, 2)

  replyId = (replyId + 1) % MAX_USHORT
  buffer.writeUInt16LE(replyId, 6)

  const prefix = Buffer.from([0x50, 0x50, 0x82, 0x7d, 0x13, 0x00, 0x00, 0x00])
  prefix.writeUInt16LE(buffer.length, 4)

  return Buffer.concat([prefix, buffer])
}

export function isValidHeader() : boolean {
  return true
}

export function removeHeader (buffer: Buffer) : Buffer {
  if (buffer.length < 8) {
    return buffer
  }

  if (buffer.compare(Buffer.from([0x50, 0x50, 0x82, 0x7d]), 0, 4, 0, 4) !== 0) {
    return buffer
  }

  return buffer.slice(8)
}
