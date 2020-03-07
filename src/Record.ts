export interface Record {
  /**
   * Internal ID
   *
   * In some devices, it is Record ID, but some devices it is internal user ID
   *
   * For reliable user ID, use UserId instead
   */
  id: number,

  /**
   * User ID
   *
   * Input via Add User in the device menu
   */
  userId?: string,

  /**
   * Verification Method
   */
  verifyMethod: number,

  /**
   * Attendance Record timestamp
   */
  timestamp: string,

  /**
   * Verification State
   */
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
