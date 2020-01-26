// Doc: https://github.com/adrobinoga/zk-protocol/blob/master/protocol.md

export const CommandCodes = Object.freeze({
  /** Begin connection. */
  CMD_CONNECT: 1000,

  /** Disconnect. */
  CMD_EXIT: 1001,

  /** Change machine state to "normal work". */
  CMD_ENABLEDEVICE: 1002,

  /** Disables fingerprint, rfid reader and keyboard. */
  CMD_DISABLEDEVICE: 1003,

  /** Restart machine. */
  CMD_RESTART: 1004,

  /** Shut-down machine. */
  CMD_POWEROFF: 1005,

  /** Change machine state to "idle". */
  CMD_SLEEP: 1006,

  /** Change machine state to "awaken". */
  CMD_RESUME: 1007,

  /** Capture fingerprint picture. */
  CMD_CAPTUREFINGER: 1009,

  /** Test if fingerprint exists. */
  CMD_TEST_TEMP: 1011,

  /** Capture the entire image. */
  CMD_CAPTUREIMAGE: 1012,

  /** Refresh the machine stored data. */
  CMD_REFRESHDATA: 1013,

  /** Refresh the configuration parameters. */
  CMD_REFRESHOPTION: 1014,

  /** Test voice. */
  CMD_TESTVOICE: 1017,

  /** Request the firmware edition. */
  CMD_GET_VERSION: 1100,

  /** Change transmission speed. */
  CMD_CHANGE_SPEED: 1101,

  /** Request to begin session using commkey. */
  CMD_AUTH: 1102,

  /** Prepare for data transmission. */
  CMD_PREPARE_DATA: 1500,

  /** Data packet. */
  CMD_DATA: 1501,

  /** Release buffer used for data transmission. */
  CMD_FREE_DATA: 1502,

  /** Read/Write a large data set. */
  CMD_DATA_WRRQ: 1503,

  /** Indicates that it is ready to receive data. */
  CMD_DATA_RDY: 1504,

  /** Read saved data. */
  CMD_DB_RRQ: 7,

  /** Upload user data. */
  CMD_USER_WRQ: 8,

  /** Read user fingerprint template. */
  CMD_USERTEMP_RRQ: 9,

  /** Upload user fingerprint template. */
  CMD_USERTEMP_WRQ: 10,

  /** Read configuration value of the machine. */
  CMD_OPTIONS_RRQ: 11,

  /** Change configuration value of the machine. */
  CMD_OPTIONS_WRQ: 12,

  /** Request attendance log. */
  CMD_ATTLOG_RRQ: 13,

  /** Delete data. */
  CMD_CLEAR_DATA: 14,

  /** Delete attendance record. */
  CMD_CLEAR_ATTLOG: 15,

  /** Delete user. */
  CMD_DELETE_USER: 18,

  /** Delete user fingerprint template. */
  CMD_DELETE_USERTEMP: 19,

  /** Clears admins privileges. */
  CMD_CLEAR_ADMIN: 20,

  /** Read user group. */
  CMD_USERGRP_RRQ: 21,

  /** Set user group. */
  CMD_USERGRP_WRQ: 22,

  /** Get user timezones. */
  CMD_USERTZ_RRQ: 23,

  /** Set the user timezones. */
  CMD_USERTZ_WRQ: 24,

  /** Get group timezone. */
  CMD_GRPTZ_RRQ: 25,

  /** Set group timezone. */
  CMD_GRPTZ_WRQ: 26,

  /** Get device timezones. */
  CMD_TZ_RRQ: 27,

  /** Set device timezones. */
  CMD_TZ_WRQ: 28,

  /** Get group combination to unlock. */
  CMD_ULG_RRQ: 29,

  /** Set group combination to unlock. */
  CMD_ULG_WRQ: 30,

  /** Unlock door for a specified amount of time. */
  CMD_UNLOCK: 31,

  /** Restore access control to default. */
  CMD_CLEAR_ACC: 32,

  /** Delete operations log. */
  CMD_CLEAR_OPLOG: 33,

  /** Read operations log. */
  CMD_OPLOG_RRQ: 34,

  /** Request machine status (remaining space). */
  CMD_GET_FREE_SIZES: 50,

  /** Enables the ":" in screen clock. */
  CMD_ENABLE_CLOCK: 57,

  /** Set the machine to authentication state. */
  CMD_STARTVERIFY: 60,

  /** Start enroll procedure. */
  CMD_STARTENROLL: 61,

  /** Disable normal authentication of users. */
  CMD_CANCELCAPTURE: 62,

  /** Query state. */
  CMD_STATE_RRQ: 64,

  /** Prints chars to the device screen. */
  CMD_WRITE_LCD: 66,

  /** Clear screen captions. */
  CMD_CLEAR_LCD: 67,

  /** Request max size for users id. */
  CMD_GET_PINWIDTH: 69,

  /** Upload short message. */
  CMD_SMS_WRQ: 70,

  /** Download short message. */
  CMD_SMS_RRQ: 71,

  /** Delete short message. */
  CMD_DELETE_SMS: 72,

  /** Set user short message. */
  CMD_UDATA_WRQ: 73,

  /** Delete user short message. */
  CMD_DELETE_UDATA: 74,

  /** Get door state. */
  CMD_DOORSTATE_RRQ: 75,

  /** Write data to Mifare card. */
  CMD_WRITE_MIFARE: 76,

  /** Clear Mifare card. */
  CMD_EMPTY_MIFARE: 78,

  /** Change verification style of a given user. */
  CMD_VERIFY_WRQ: 79,

  /** Read verification style of a given user. */
  CMD_VERIFY_RRQ: 80,

  /** Transfer fp template from buffer. */
  CMD_TMP_WRITE: 87,

  /** Get checksum of machine's buffer. */
  CMD_CHECKSUM_BUFFER: 119,

  /** Deletes fingerprint template. */
  CMD_DEL_FPTMP: 134,

  /** Request machine time. */
  CMD_GET_TIME: 201,

  /** Set machine time. */
  CMD_SET_TIME: 202,

  /** Realtime events. */
  CMD_REG_EVENT: 500
})

export const ReplyCodes = Object.freeze({
  /** Requested data was prepared, ready to sent back */
  CMD_PREPARE_DATA: 1500,

  /** Start sending data, after prepared */
  CMD_DATA: 1501,

  /** The request was processed sucessfully. */
  CMD_ACK_OK: 2000,

  /** There was an error when processing the request. */
  CMD_ACK_ERROR: 2001,

  /**  */
  CMD_ACK_DATA: 2002,

  /**  */
  CMD_ACK_RETRY: 2003,

  /**  */
  CMD_ACK_REPEAT: 2004,

  /** Connection not authorized. */
  CMD_ACK_UNAUTH: 2005,

  /** Received unknown command. */
  CMD_ACK_UNKNOWN: 65535,

  /**  */
  CMD_ACK_ERROR_CMD: 65533,

  /**  */
  CMD_ACK_ERROR_INIT: 65532,

  /**  */
  CMD_ACK_ERROR_DATA: 65531,
})

export const EventCodes = Object.freeze({
  /** Attendance entry. */
  EF_ATTLOG: 1,

  /** Pressed finger. */
  EF_FINGER: 2,

  /** Enrolled user. */
  EF_ENROLLUSER: 4,

  /** Enrolled fingerprint. */
  EF_ENROLLFINGER: 8,

  /** Pressed keyboard key. */
  EF_BUTTON: 16,

  /**  */
  EF_UNLOCK: 32,

  /** Registered user placed finger. */
  EF_VERIFY: 128,

  /** Fingerprint score in enroll procedure. */
  EF_FPFTR: 256,

  /** Triggered alarm. */
  EF_ALARM: 512
})

export const ParamCodes = Object.freeze({
  /** Platform name (string) */
  PR_PLATFORM: '~Platform',

  /** Device's version (number) */
  PR_FINGER_VERSION: '~ZKFPVersion',

  /** */
  PR_FACE_VERSION: 'ZKFaceVersion',

  /** OS information */
  PR_OS: '~OS',

  /**  */
  PR_EXTEND_FORMAT: '~ExtendFmt',

  /**  */
  PR_EXTEND_OP_LOG: 'ExtendOPLog',

  /** Work Code (boolean) */
  PR_WORK_CODE: 'WorkCode',

  /** Language code */
  PR_LANGUAGE: 'Language',

  /** Biometric type */
  PR_BIOMETRIC_TYPE: 'BiometricType',

  /** Vendor name (string) */
  PR_VENDOR: '~OEMVendor',

  /** Device name (string) */
  PR_DEVICE_NAME: '~DeviceName',

  /** MAC Address */
  PR_MAC_ADDRESS: 'MAC',

  /** Serial number */
  PR_SERIAL_NO: '~SerialNumber',

  /** Product time (date string, 24hrs format) */
  PR_PRODUCT_TIME: '~ProductTime',

  /** PIN2 Width (number) */
  PR_PIN2_WIDTH: '~PIN2Width',

  /** Is ABC PIN enable (boolean) */
  PR_ABC_PIN_ON: '~IsABCPinEnable',

  /** Is T9 function on (boolean) */
  PR_T9_ON: '~T9FunOn',

  /** Is only RFID support (boolean) */
  PR_ONLY_RFID: '~IsOnlyRFMachine',

  /** Is fingerprint function is on (boolean) */
  PR_FINGER_ON: 'FingerFunOn',

  /** Is face function is on (boolean) */
  PR_FACE_ON: 'FaceFunOn',
})

export const DeviceCodes = Object.freeze({
  /**
   * Device ID.
   *
   * Value ranges from 1 to 254.
   *
   * Mode: RW
   */
  DP_DEVICE_ID: 'DeviceID',

  /**
   * Language.
   *
   * For english it is 97.
   *
   * Mode: RW
   */
  DP_NEW_LNG: 'NewLng',

  /**
   * The machine will enter standby state or power off, after this time elapses.
   *
   * Given in minutes.
   *
   * Mode: RW
   */
  DP_IDLE_MINUTE: 'IdleMinute',

  /**
   * Lock control time.
   *
   * Given in seconds.
   *
   * Mode: RW
   */
  DP_LOCKON: 'LockOn',

  /**
   * Attendance record quantity alarm.
   *
   * Mode: RW
   */
  DP_ALARM_ATTLOG: 'AlarmAttLog',

  /**
   * Operation record quantity alarm.
   *
   * Mode: RW
   */
  DP_ALARM_OPLOG: 'AlarmOpLog',

  /**
   * Minimun time to record the same attendance state.
   *
   * Units are unknown.
   *
   * Mode: RW
   */
  DP_ALARM_REREC: 'AlarmReRec',

  /**
   * Baud rate for RS232/485.
   *
   * Valid values are 1200, 2400, 4800, 9600, 19200, 38400 57600, 115200.
   *
   * Mode: RW
   */
  DP_RS232_BAUDRATE: 'RS232BaudRate',

  /**
   * Enable flag for network functions.
   *
   * Mode: RW
   */
  DP_NETWORK_ON: 'NetworkOn',

  /**
   * Enable flag for RS232.
   *
   * Mode: RW
   */
  DP_RS232_ON: 'RS232On',

  /**
   * Enable flag for RS485.
   *
   * Mode: RW
   */
  DP_RS485_ON: 'RS485On',

  /**
   * Enable announcements(voice).
   *
   * Mode: RW
   */
  DP_VOICE_ON: 'VoiceOn',

  /**
   * Perform high-speed comparison.
   *
   * Value codification is unknown.
   *
   * Mode: RW
   */
  DP_MSPEED: 'MSpeed',

  /**
   * Idle mode.
   *
   * 87 indicates shutdown and 88 indicates hibernation.
   *
   * Mode: RW
   */
  DP_IDLE_POWER: 'IdlePower',

  /**
   * Automatic shutdown time.
   *
   * Value 255 indicates the machine to not shutdown automatically.
   *
   * Mode: RW
   */
  DP_AUTO_POWE_OFF: 'AutoPowerOff',

  /**
   * Automatic startup time.
   *
   * Value 255 indicates the machine to not startup automatically.
   *
   * Mode: RW
   */
  DP_AUTO_POWER_ON: 'AutoPowerOn',

  /**
   * Automatic hibernation time.
   *
   * Value 255 indicates the machine to not suspend automatically.
   *
   * Mode: RW
   */
  DP_AUTO_POWER_SUSPEND: 'AutoPowerSuspend',

  /**
   * Alarm 1 time.
   *
   * Value 65535 disables the alarm(t).
   *
   * Mode: RW
   */
  DP_AUTO_ALARM1: 'AutoAlarm1',

  /**
   * 1:N comparison threshold.
   *
   * Integer.
   *
   * Mode: RW
   */
  DP_MTHRESHOLD: 'MThreshold',

  /**
   * Registration threshold.
   *
   * Integer.
   *
   * Mode: RW
   */
  DP_ETHRESHOLD: 'EThreshold',

  /**
   * 1:1 comparison threshold.
   *
   * Integer.
   *
   * Mode: RW
   */
  DP_VTHRESHOLD: 'VThreshold',

  /**
   * Display matching score during verification.
   *
   * Bool.
   *
   * Mode: RW
   */
  DP_SHOWSCORE: 'ShowScore',

  /**
   * Number of people that may unlock the door at the same time.
   *
   * Integer.
   *
   * Mode: RW
   */
  DP_UNLOCK_PERSON: 'UnlockPerson',

  /**
   * Verify only the card number.
   *
   * Bool.
   *
   * Mode: RW
   */
  DP_ONLY_PINCARD: 'OnlyPINCard',

  /**
   * Network speed.
   *
   * Value correspondence: 1=100M-H, 4=10M-F, 5=100M-F, 8=Auto, others=10M-H.
   *
   * Mode: RW
   */
  DP_HISPEED_NET: 'HiSpeedNet',

  /**
   * Accept only registered cards.
   *
   * Bool.
   *
   * Mode: RW
   */
  DP_MUST_ENROLL: 'MustEnroll',

  /**
   * Timeout to return to the initial state if there are no inputs after entering PIN.
   *
   * Given in seconds.
   *
   * Mode: RW
   */
  DP_TO_STATE: 'TOState',

  /**
   * Timeout to return to the initial state if there are no inputs after entering menu.
   *
   * Given in seconds.
   *
   * Mode: RW
   */
  DP_TO_MENU: 'TOMenu',

  /**
   * Time format.
   *
   * Value codification is unknown.
   *
   * Mode: NA
   */
  DP_DT_FMT: 'DtFmt',

  /**
   * Flag for mandatory 1:1 comparison.
   *
   * Bool.
   *
   * Mode: RW
   */
  DP_MUST_1TO1: 'Must1To1',

  /**
   * Alarm 2 time.
   *
   * Value 65535 disables the alarm(t).
   *
   * Mode: RW
   */
  DP_AUTO_ALARM2: 'AutoAlarm2',

  /**
   * Alarm 3 time.
   *
   * Value 65535 disables the alarm(t).
   *
   * Mode: RW
   */
  DP_AUTO_ALARM3: 'AutoAlarm3',

  /**
   * Alarm 4 time.
   *
   * Value 65535 disables the alarm(t).
   *
   * Mode: RW
   */
  DP_AUTO_ALARM4: 'AutoAlarm4',

  /**
   * Alarm 5 time.
   *
   * Value 65535 disables the alarm(t).
   *
   * Mode: RW
   */
  DP_AUTO_ALARM5: 'AutoAlarm5',

  /**
   * Alarm 6 time.
   *
   * Value 65535 disables the alarm(t).
   *
   * Mode: RW
   */
  DP_AUTO_ALARM6: 'AutoAlarm6',

  /**
   * Automatic status changing times.
   *
   * -1 value indicates that the status will not change automatically.
   *
   * Mode: ?
   */
  DP_AS1: 'AS1',

  /**
   * Automatic status changing times.
   *
   * -1 value indicates that the status will not change automatically.
   *
   * Mode: ?
   */
  DP_AS2: 'AS2',

  /**
   * Automatic status changing times.
   *
   * -1 value indicates that the status will not change automatically.
   *
   * Mode: ?
   */
  DP_AS3: 'AS3',

  /**
   * Automatic status changing times.
   *
   * -1 value indicates that the status will not change automatically.
   *
   * Mode: ?
   */
  DP_AS4: 'AS4',

  /**
   * Automatic status changing times.
   *
   * -1 value indicates that the status will not change automatically.
   *
   * Mode: ?
   */
  DP_AS5: 'AS5',

  /**
   * Automatic status changing times.
   *
   * -1 value indicates that the status will not change automatically.
   *
   * Mode: ?
   */
  DP_AS6: 'AS6',

  /**
   * Automatic status changing times.
   *
   * -1 value indicates that the status will not change automatically.
   *
   * Mode: ?
   */
  DP_AS7: 'AS7',

  /**
   * Automatic status changing times.
   *
   * -1 value indicates that the status will not change automatically.
   *
   * Mode: ?
   */
  DP_AS8: 'AS8',

  /**
   * Automatic status changing times.
   *
   * -1 value indicates that the status will not change automatically.
   *
   * Mode: ?
   */
  DP_AS9: 'AS9',

  /**
   * Automatic status changing times.
   *
   * -1 value indicates that the status will not change automatically.
   *
   * Mode: ?
   */
  DP_AS10: 'AS10',

  /**
   * Automatic status changing times.
   *
   * -1 value indicates that the status will not change automatically.
   *
   * Mode: ?
   */
  DP_AS11: 'AS11',

  /**
   * Automatic status changing times.
   *
   * -1 value indicates that the status will not change automatically.
   *
   * Mode: ?
   */
  DP_AS12: 'AS12',

  /**
   * Automatic status changing times.
   *
   * -1 value indicates that the status will not change automatically.
   *
   * Mode: ?
   */
  DP_AS13: 'AS13',

  /**
   * Automatic status changing times.
   *
   * -1 value indicates that the status will not change automatically.
   *
   * Mode: ?
   */
  DP_AS14: 'AS14',

  /**
   * Automatic status changing times.
   *
   * -1 value indicates that the status will not change automatically.
   *
   * Mode: ?
   */
  DP_AS15: 'AS15',

  /**
   * Automatic status changing times.
   *
   * -1 value indicates that the status will not change automatically.
   *
   * Mode: ?
   */
  DP_AS16: 'AS16',

  /**
   * Wiegand failure ID.
   *
   * Mode: ?
   */
  DP_WG_FAILED_ID: 'WGFailedID',

  /**
   * Wiegand duress ID.
   *
   * Mode: ?
   */
  DP_WG_DURESS_ID: 'WGDuressID',

  /**
   * Wiegand zone bit.
   *
   * Mode: ?
   */
  DP_WG_SITECODE: 'WGSiteCode',

  /**
   * Pulse width of Wiegand outputs.
   *
   * Mode: ?
   */
  DP_WG_PULSE_WIDTH: 'WGPulseWidth',

  /**
   * Pulse interval for Wiegand outputs.
   *
   * Mode: ?
   */
  DP_WG_PULSE_INTERVAL: 'WGPulseInterval',

  /**
   * ID of the start sector on the Mifare card where fingerprints are stored.
   *
   * Mode: ?
   */
  DP_RFS_START: '~RFSStart',

  /**
   * Total number of sectors on the Mifare card where fingerprints are stored.
   *
   * Mode: ?
   */
  DP_RFS_LEN: '~RFSLen',

  /**
   * Number of fingerprints stored on the Mifare card.
   *
   * Mode: ?
   */
  DP_RF_FPC: '~RFFPC',

  /**
   * Wheter to display the attendance status.
   *
   * Mode: RW
   */
  DP_SHOW_STATE: '~ShowState',

  /**
   * TCP Port.
   *
   * Mode: ?
   */
  DP_TCP_PORT: 'TCPPort',

  /**
   * UDP Port.
   *
   * Mode: ?
   */
  DP_UDP_PORT: 'UDPPort',

  /**
   * Fingerprint algorithm version.
   *
   * Mode: R
   */
  DP_ZKFP_VERSION: '~ZKFPVersion',

  /**
   * Face algorithm version.
   *
   * Mode: R
   */
  DP_ZKFACE_VERSION: '~ZKFaceVersion',

  /**
   * Finger vein version.
   *
   * Mode: R
   */
  DP_ZKFV_VERSION: '~ZKFVVersion',

  /**
   * Face function.
   *
   * Mode: R
   */
  DP_FACE_FUN_ON: '~FaceFunOn',

  /**
   * User id max length.
   *
   * Mode: R
   */
  DP_PIN2_WIDTH: '~PIN2Width',

  /**
   * Does the user id support chars.
   *
   * Mode: R
   */
  DP_IS_SUPPORT_ABC_PIN: 'IsSupportABCPin',

  /**
   * ?
   *
   * Mode: ?
   */
  DP_IME_FUN_ON: 'IMEFunOn',

  /**
   * ?
   *
   * Mode: ?
   */
  DP_IS_SUPPORT_ALARM_EXT: 'IsSupportAlarmExt',

  /**
   * ?
   *
   * Mode: ?
   */
  DP_DCTZ: '~DCTZ',

  /**
   * ?
   *
   * Mode: ?
   */
  DP_DOTZ: '~DOTZ'
})

export const RequestCodes = Object.freeze({
  REQ_USERS: Buffer.from([ 0x01, 0x09, 0x00, 0x05, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ]),
  REQ_ATT_RECORDS: Buffer.from([ 0x01, 0x0d, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 ]),
  REQ_REALTIME_MODE: Buffer.from([ 0x01,0x00,0x00, 0x00 ])
})
