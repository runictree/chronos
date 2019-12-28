const { Device } = require('../dist/main')

async function main () {
  try {
    const d = new Device('192.168.1.237', 4370, 10000)

    const isConnected = await d.connect()
    console.log('is connected', isConnected)

    await d.open()
    console.log('opened')

    const ref = await d.execute(1502)
    console.log('reference: ')
    console.log(ref)

    await d.clearBuffer()
    console.log('buffer was cleared')


    await d.close()
    const isDisconnected = await d.disconnect()
    console.log('is disconnected', isDisconnected)

    process.exit(1)
  } catch (err) {
    console.log('ERROR:: ', err.code, err.message)
  }
}

main()
