#### Command/Reply Identifiers ####

The command/reply id field may be used for two purposes:

1. Instruct the machine to do something.
2. Return an exit code from a given procedure.
3. Report events (corresponds to `CMD_REG_EVENT`).

The command id correspondence is given in the following table:

|Name			|Description						|Value[base10]	|Value[hex]	|Implement? |
|---			|---							|---		|---		|---    |
|CMD_CONNECT		|Begin connection.					|1000		|03e8		|open() |
|CMD_EXIT		|Disconnect.						|1001		|03e9		|close() |
|CMD_ENABLEDEVICE	|Change machine state to "normal work".			|1002		|03ea		|enable() |
|CMD_DISABLEDEVICE	|Disables fingerprint, rfid reader and keyboard.	|1003		|03eb		|disable() |
|CMD_RESTART		|Restart machine.					|1004		|03ec		|restart() |
|CMD_POWEROFF		|Shut-down machine.					|1005		|03ed		|shutdown() |
|CMD_SLEEP		|Change machine state to "idle".			|1006		|03ee		|sleep() |
|CMD_RESUME		|Change machine state to "awaken".			|1007		|03ef		|resume() |
|CMD_CAPTUREFINGER	|Capture fingerprint picture.				|1009		|03f1		|
|CMD_TEST_TEMP		|Test if fingerprint exists.				|1011		|03f3		|isFingerScannerExist() |
|CMD_CAPTUREIMAGE	|Capture the entire image.				|1012		|03f4		|
|CMD_REFRESHDATA	|Refresh the machine stored data.			|1013		|03f5		|
|CMD_REFRESHOPTION	|Refresh the configuration parameters.			|1014		|03f6		|
|CMD_TESTVOICE		|Test voice.						|1017		|03f9		|testVoice() |
|CMD_GET_VERSION	|Request the firmware edition.				|1100		|044c		|firmwareVersion() |
|CMD_CHANGE_SPEED	|Change transmission speed.				|1101		|044d		|
|CMD_AUTH		|Request to begin session using commkey.		|1102		|044e		|
|CMD_FREE_DATA		|Release buffer used for data transmission.		|1502		|05de		|clearBuffer() |
|CMD_DATA_WRRQ		|Read/Write a large data set.				|1503		|05df		|
|CMD_DB_RRQ		|Read saved data.					|7		|0007		|
|CMD_USER_WRQ		|Upload user data.					|8		|0008		|
|CMD_USERTEMP_RRQ	|Read user fingerprint template.			|9		|0009		|
|CMD_USERTEMP_WRQ	|Upload user fingerprint template.			|10		|000a		|
|CMD_OPTIONS_RRQ	|Read configuration value of the machine.		|11		|000b		|
|CMD_OPTIONS_WRQ	|Change configuration value of the machine.		|12		|000c		|
|CMD_ATTLOG_RRQ		|Request attendance log.				|13		|000d		|
|CMD_CLEAR_DATA		|Delete data.						|14		|000e		|
|CMD_CLEAR_ATTLOG	|Delete attendance record.				|15		|000f		|
|CMD_DELETE_USER	|Delete user.						|18		|0012		|
|CMD_DELETE_USERTEMP	|Delete user fingerprint template.			|19		|0013		|
|CMD_CLEAR_ADMIN	|Clears admins privileges.				|20		|0014		|
|CMD_USERGRP_RRQ	|Read user group.					|21		|0015		|
|CMD_USERGRP_WRQ	|Set user group.					|22		|0016		|
|CMD_USERTZ_RRQ		|Get user timezones.					|23		|0017		|
|CMD_USERTZ_WRQ		|Set the user timezones.				|24		|0018		|
|CMD_GRPTZ_RRQ		|Get group timezone.					|25		|0019		|
|CMD_GRPTZ_WRQ		|Set group timezone.					|26		|001a		|
|CMD_TZ_RRQ		|Get device timezones.					|27		|001b		|
|CMD_TZ_WRQ		|Set device timezones.					|28		|001c		|
|CMD_ULG_RRQ		|Get group combination to unlock.			|29		|001d		|
|CMD_ULG_WRQ		|Set group combination to unlock.			|30		|001e		|
|CMD_UNLOCK		|Unlock door for a specified amount of time.		|31		|001f		|
|CMD_CLEAR_ACC		|Restore access control to default.			|32		|0020		|
|CMD_CLEAR_OPLOG	|Delete operations log.					|33		|0021		|
|CMD_OPLOG_RRQ		|Read operations log.					|34		|0022		|
|CMD_GET_FREE_SIZES	|Request machine status (remaining space).		|50		|0032		|capacities() |
|CMD_ENABLE_CLOCK	|Enables the ":" in screen clock.			|57		|0039		|
|CMD_STARTVERIFY	|Set the machine to authentication state.		|60		|003c		|
|CMD_STARTENROLL	|Start enroll procedure.				|61		|003d		|
|CMD_CANCELCAPTURE	|Disable normal authentication of users.		|62		|003e		|
|CMD_STATE_RRQ		|Query state.						|64		|0040		|
|CMD_WRITE_LCD		|Prints chars to the device screen.			|66		|0042		|
|CMD_CLEAR_LCD		|Clear screen captions.					|67		|0043		|
|CMD_GET_PINWIDTH	|Request max size for users id.				|69		|0045		|
|CMD_SMS_WRQ		|Upload short message.					|70		|0046		|
|CMD_SMS_RRQ		|Download short message.				|71		|0047		|
|CMD_DELETE_SMS		|Delete short message.					|72		|0048		|
|CMD_UDATA_WRQ		|Set user short message.				|73		|0049		|
|CMD_DELETE_UDATA	|Delete user short message.				|74		|004a		|
|CMD_DOORSTATE_RRQ	|Get door state.					|75		|004b		|
|CMD_WRITE_MIFARE	|Write data to Mifare card.				|76		|004c		|
|CMD_EMPTY_MIFARE	|Clear Mifare card.					|78		|004e		|
|CMD_VERIFY_WRQ		|Change verification style of a given user.		|79		|004f		|
|CMD_VERIFY_RRQ		|Read verification style of a given user.		|80		|0050		|
|CMD_TMP_WRITE		|Transfer fp template from buffer.			|87		|0057		|
|CMD_CHECKSUM_BUFFER	|Get checksum of machine's buffer.			|119		|0077		|
|CMD_DEL_FPTMP		|Deletes fingerprint template.				|134		|0086		|
|CMD_GET_TIME		|Request machine time.					|201		|00c9		|getTime() |
|CMD_SET_TIME		|Set machine time.					|202		|00ca		|
|CMD_REG_EVENT		|Realtime events.					|500		|01f4		|

See the codification of reply codes in the following table:

|Name			|Description						|Value[base10]	|Value[hex]	|
|---			|---							|---		|---		|
|CMD_ACK_OK		|The request was processed sucessfully.			|2000		|07d0		|
|CMD_ACK_ERROR		|There was an error when processing the request.	|2001		|07d1		|
|CMD_ACK_DATA		|							|2002		|07d2		|
|CMD_ACK_RETRY		|							|2003		|07d3		|
|CMD_ACK_REPEAT		|							|2004		|07d4		|
|CMD_ACK_UNAUTH		|Connection not authorized.				|2005		|07d5		|
|CMD_ACK_UNKNOWN	|Received unknown command.				|65535		|ffff		|
|CMD_ACK_ERROR_CMD	|							|65533		|fffd		|
|CMD_ACK_ERROR_INIT	|							|65532		|fffc		|
|CMD_ACK_ERROR_DATA	|							|65531		|fffb		|
