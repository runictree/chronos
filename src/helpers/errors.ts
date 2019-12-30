export const errors : { [key: string]: string } = Object.freeze({
  UNKNOWN: 'Unknown Error',
  EXEC_FAILED: 'Unable to execute command on the device',
  INVALID_REPLY_CODE: 'Reply code is not valid',
  NO_SESSION: 'Session ID not found in reply message',
  DEVICE_EXEC_ERROR: 'Unable to processing request',
  UNAUTHORIZE: 'Unauthorized',
  UNKNOWN_COMMAND: 'Unknown command code',
  RESPONSE_RETRY: 'Device response with CMD_ACK_RETRY',
  RESPONSE_REPEAT: 'Device response with CMD_ACK_REPEAT',
  RESPONSE_ERROR_CMD: 'Device response with CMD_ACK_ERROR_CMD',
  RESPONSE_ERROR_INIT: 'Device reponse with CMD_ACK_ERROR_INIT',
  RESPONSE_ERROR_DATA: 'Device response with CMD_ACK_ERROR_DATA'
})
