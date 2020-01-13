const { TimeAttendance } = require('../dist/main')
const { wait } = require('../dist/helpers/utilities')

async function main () {
  const host = process.argv[2]
  const port = parseInt(process.argv[3], 10)
  // const d = new Device('192.168.1.237', 4370, 10000)
  const d = new TimeAttendance(host, port, 10000)

  try {
    await d.connect()

    console.log('is connected', d.isConnected())

    await d.open()
    console.log('connection was opened')

    await d.clearBuffer()
    console.log('transmission buffer was cleared')

    const cap = await d.capacities()
    console.log('device capacities', cap)

    const users = await d.users()
    console.log('user information was received')
    console.log('first user', users[0])
    console.log('last user', users[users.length - 1])

    const att = await d.attendanceRecords()
    console.log('attendence records was retrieved')
    console.log('first record', att[0])
    console.log('last record', att[att.length - 1])

    await d.close()
    console.log('connection was closed')

    await d.disconnect()
    console.log('disconnected')
  } catch (err) {
    console.log(err.code, '=>', err.message, '=>>', err.params)
    if (d.isConnected()) {
      d.disconnect()
    }
  }
}

main()
