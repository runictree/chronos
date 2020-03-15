export const errors : { [key: string]: string } = Object.freeze({
  UNKNOWN_ERROR: 'Unknown Error',
  ECONNREFUSED: 'Connection refused by server',
  ECONNRESET: 'Connection reset by peer',
  ENOTFOUND: 'Unable to resolve hostname from DNS records, please verify given hostname is correct',
  ETIMEDOUT: 'Connection timeout',
  EXEC_FAILED: 'Unable to execute command on the device',
  EXEC_TIMEDOUT: 'Device is not response',
  INVALID_REPLY_CODE: 'Reply code is not valid',
  NO_SESSION: 'Session ID not found in reply message',
  DEVICE_EXEC_ERROR: 'Unable to processing request',
  UNAUTHORIZED: 'Device report back with unauthorized',
  UNKNOWN_COMMAND: 'Device is not support this command',
  PROCESSING_ERROR: 'Error occurred while processing data',
  UNMATCH_CONTENT_SIZE: 'Report content size is unmatch with transferred data size',
  SIZE_MISMATCH: 'Size at position 16+1 is unmatch with position 16+5, please report'
})
