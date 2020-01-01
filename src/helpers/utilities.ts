import { MAX_USHORT } from './constants'
import { User } from '../User'
import { AttendanceRecord } from '../AttendanceRecord'

export function timeToDate (time: number) : Date {
  const second = time % 60
  const minute = (time / 60) % 60
  const hour = (time / 60 * 60) % 24
  const day = ((time / (60 * 60 * 24)) % 31) + 1
  const month = ((time / (60 * 60 * 24 * 31)) % 12)
  const year = (time / (60 * 60 * 24 * 31 * 12)) + 2000

  return new Date(year, month, day, hour, minute, second)
}

export function hexToDate () : Date {
  return new Date()
}

export function createChecksum (buffer: Buffer) {
  let sum = 0;
  const length = buffer.length

  for (let i = 0; i < length; i += 2) {
    if (i === length - 1) {
      sum += buffer[i]
    } else {
      sum += buffer.readUInt16LE(i)
    }

    sum %= MAX_USHORT
  }

  sum = MAX_USHORT - sum - 1

  return sum
}

export function decodeRecordData (buffer: Buffer) : AttendanceRecord {
  return {
    id: buffer.readUInt16LE(0),
    userId: buffer.subarray(2, 2 + 9).toString('ascii').split('\0').shift(),
    verifyMethod: buffer.readUInt8(26),
    timestamp: timeToDate(buffer.readUInt32LE(27)),
    verifyState: buffer.readUInt8(31)
  }
}

export function decodeUserData (buffer: Buffer) : User {
  return {
    id: buffer.readUInt16LE(0),
    permissionToken: buffer.readUInt8(2),
    password: buffer.subarray(3, 3 + 8).toString('ascii').split('\0').shift(),
    name: buffer.subarray(11, 11 + 24).toString('ascii').split('\0').shift(),
    cardNo: buffer.readUInt32LE(35),
    groupNo: buffer.readUInt8(39),
    tzFlag: buffer.readUInt16LE(40),
    tz1: buffer.readUInt16LE(42),
    tz2: buffer.readUInt16LE(44),
    tz3: buffer.readUInt16LE(46),
    userId: buffer.subarray(48, 48 + 9).toString('ascii').split('\0').shift()
  }
}

export function decodeRealtimeRecordData () : string {
  return ''
}

export function wait (ms: number) : Promise<boolean> {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), ms)
  })
}
