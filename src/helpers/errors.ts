export const errors : { [key: string]: string } = Object.freeze({
  UNKNOWN_ERROR: 'Unknown Error',
  ECONNREFUSED: 'Connection refused by server',
  ECONNRESET: 'Connection reset by peer',
  ENOTFOUND: 'Unable to resolve hostname from DNS records, please verify given hostname is correct',
  EXEC_FAILED: 'Unable to execute command on the device',
  INVALID_REPLY_CODE: 'Reply code is not valid',
  NO_SESSION: 'Session ID not found in reply message',
  DEVICE_EXEC_ERROR: 'Unable to processing request',
  UNAUTHORIZE: 'Unauthorized',
  UNKNOWN_COMMAND: 'Unknown command code',
  UNMATCH_CONTENT_SIZE: 'Reported content size is unmatch with transferred content size, (partial transferred)'
})
