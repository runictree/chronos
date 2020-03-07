const fs = require('fs')
const { TimeAttendance } = require('../dist/main')
const utils = require('../dist/helpers/utilities')
const tcp = require('../dist/helpers/tcp')

async function main () {
  const host = process.argv[2] || '127.0.0.1'
  const port = parseInt(process.argv[3], 10) || 4370
  const timeout = parseInt(process.argv[4], 10) || 10000
  // const d = new Device('192.168.1.237', 4370, 10000)
  const d = new TimeAttendance(host, port, timeout)

  try {
    await d.connect()

    console.log('is connect', d.isConnected())

    await d.open()
    console.log('device is open')

    // const disable = await d.disable()
    // console.log('disable device', disable)

    await d.clearBuffer()
    console.log('transmission buffer was cleared')

    const cap = await d.capacities()
    console.log('device capacities', cap)

    const version = await d.firmwareVersion()
    console.log('version', version)

    const time = await d.getTime()
    console.log('time', time)

    const users = await d.getUsers()
    console.log('user information was received', users.length)
    console.log('first user', users[0])
    console.log('last user', users[users.length - 1])

    const att = await d.getRecords()
    console.log('attendence records was retrieved', att.length)
    console.log('first record', att[0])
    console.log('last record', att[att.length - 1])

    const out = att.map((record) => {
      return `${record.userId}\t${record.timestamp}\t${record.id}`
    })

    fs.writeFileSync('out.txt', out.join('\n'))

    // const enable = await d.enable()
    // console.log('enable device', enable)

    await d.close()
    console.log('device is closed')

    await d.disconnect()
    console.log('disconnected')
  } catch (err) {
    console.log('ERROR CODE:    ', err.code)
    console.log('ERROR MESSAGE: ', err.message)
    console.log('ERROR PAYLOAD: ', err.params)
    console.log(err)

    if (d.isConnected()) {
      await d.disconnect()
    }
  }
}

main()
