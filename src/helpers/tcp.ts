import { MAX_USHORT } from './constants'
import { SocketError } from '../SocketError'
import { ReplyCodes } from '../protocol'
import * as utils from './utilities'

interface Header {
  /** Reply code */
  replyCode: number,

  /** Session ID */
  sessionId: number,

  /** Reply ID */
  replyId: number,

  /** Package size */
  size: number,

  /** Checksum */
  checksum: number
}

export function createHeader (command: number, sessionId: number, requestId: number, params?: Buffer) : Buffer {
  if (!params) {
    params = Buffer.from([])
  }

  const buffer = Buffer.alloc(8 + params.length)

  buffer.writeUInt16LE(command, 0)
  buffer.writeUInt16LE(0, 2)
  buffer.writeUInt16LE(sessionId, 4)
  buffer.writeUInt16LE(requestId, 6)

  params.copy(buffer, 8)

  const checkSum = utils.createChecksum(buffer)
  buffer.writeUInt16LE(checkSum, 2)

  requestId = (requestId + 1) % MAX_USHORT
  buffer.writeUInt16LE(requestId, 6)

  const prefix = Buffer.from([0x50, 0x50, 0x82, 0x7d, 0x13, 0x00, 0x00, 0x00])
  prefix.writeUInt16LE(buffer.length, 4)

  return Buffer.concat([prefix, buffer])
}

export function removeHeader (buffer: Buffer) : Buffer {
  if (buffer.length < 16) {
    return buffer
  }

  if (buffer.compare(Buffer.from([0x50, 0x50, 0x82, 0x7d]), 0, 4, 0, 4) !== 0) {
    return buffer
  }

  return buffer.subarray(16)
}

export function decodeHeader (buffer: Buffer) : Header {
  return {
    replyCode: buffer.readUInt16LE(8),
    sessionId: buffer.readUInt16LE(12),
    replyId: buffer.readUInt16LE(14),
    size: buffer.readUInt16LE(4),
    checksum: buffer.readUInt16LE(10)
  }
}

export function isValidHeader (buffer: Buffer, replyId: number) : boolean {
  const header = decodeHeader(buffer)

  return buffer.compare(Buffer.from([ 0x50, 0x50, 0x82, 0x7d ]), 0, 4, 0, 4) === 0 &&
    header.replyId === replyId
}

export function isOk (data: Buffer) : boolean {
  const replyCode = data.readUInt16LE(8)

  if (replyCode !== ReplyCodes.CMD_ACK_OK) {
    throw new SocketError('INVALID_REPLY_CODE', replyCode)
  }

  return true
}
