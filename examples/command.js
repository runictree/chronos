const { TimeAttendance } = require('../dist/main')
const { wait } = require('../dist/helpers/utilities')

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

    await d.testFs()
    console.log('did you hear something?')
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
