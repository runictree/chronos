import { MAX_USHORT } from './constants'
import User from '../UserInterface'

export function timeToDate () : Date {
  return new Date()
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

export function decodeRecordDate () : string {
  return ''
}

export function decodeUserData (buffer: Buffer) : User {
  return {
    id: buffer.readUIntLE(0, 2),
    role: buffer.readUIntLE(2, 1),
    password: buffer.subarray(3, 3 + 8).toString('ascii').split('\0').shift(),
    name: buffer.subarray(11).toString('ascii').split('\0').shift(),
    card: buffer.readUIntLE(35, 4),
    uid: buffer.subarray(48, 48 + 9).toString('ascii').split('\0').shift()
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
