export interface AttendanceRecord {
  id: number,
  userId: string,
  verifyMethod: number,
  timestamp: Date,
  verifyState: number
}

export const VerificationMethods = Object.freeze({
  password: 0,
  fingerprint: 1,
  rfidCard: 2
})

export const VerificationStates = Object.freeze({
  checkIn: 0,
  checkOut: 1,
  breakOut: 2,
  breakIn: 3,
  otIn: 4,
  otOut: 5
})
