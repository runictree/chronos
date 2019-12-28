export const errors : { [key: string]: string } = Object.freeze({
  UNKNOWN: 'Unknown Error',
  EXEC_FAILED: 'Unable to execute command on the device',
  INVALID_REPLY_CODE: 'Reply code is not valid',
  NO_SESSION: 'Session ID not found in reply message'
})
