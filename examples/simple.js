const { Device } = require('../dist/main')
const { wait } = require('../dist/helpers/utilities')

async function main () {
  const d = new Device('192.168.1.237', 4370, 10000)

  try {
    await d.connect()
    console.log('is connected', d.isConnected())

    await d.open()
    console.log('connection was opened')

    await d.clearBuffer()
    console.log('transmission buffer was cleared')

    // const cap = await d.capacities()
    // console.log('device capacities', cap)

    const users = await d.users()
    console.log('user information was received')
    console.log('user no. 288', users[287])

    await d.close()
    console.log('connection was closed')

    await d.disconnect()
    console.log('disconnected')
  } catch (err) {
    console.log(err.code, err.message)
    if (d.isConnected()) {
      d.disconnect()
    }
  }
}

main()
