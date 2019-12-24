const { Device } = require('../dist/main')

async function main () {
  try {
    const d = new Device('192.168.1.237', 4370, 10000)

    const isConnected = await d.connect()

    console.log('is connected', isConnected)

    const isDisconnected = await d.disconnect()

    console.log('is disconnected', isDisconnected)

    process.exit(1)
  } catch (err) {
    console.log('ERROR:: ', err.code, err.message)
  }
}

main()
