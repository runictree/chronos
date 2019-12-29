const { Device } = require('../dist/main')
const { wait } = require('../dist/helpers/utilities')

async function main () {
  const d = new Device('192.168.1.237', 4370, 10000)

  await d.connect()
  console.log('is connected', d.isConnected())

  await d.open()
  console.log('connection was opened')

  await d.clearBuffer()
  console.log('transmission buffer was cleared')

  const cap = await d.capacities()
  console.log('device capacities', cap)

  await d.close()
  console.log('connection was closed')

  await d.disconnect()
  console.log('disconnected')
}

main()
