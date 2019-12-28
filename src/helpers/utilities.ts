import { MAX_USHORT } from './constants'

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

export function decodeUserData () : string {
  return ''
}

export function decodeRealtimeRecordData () : string {
  return ''
}

export function wait (ms: number) : Promise<boolean> {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), ms)
  })
}
