const mqtt = require('mqtt')

const protocol = 'mqtt'
const host = '3.82.100.202'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `${protocol}://${host}:${port}`

const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'steve',
    password: 'josexo',
    reconnectPeriod: 1000,
  })
  
  client.on('connect', () => {
    console.log('Connected')
  })
  
  const topic = 'test'

  client.on('connect', () => {
    console.log('Connected')
    client.subscribe([topic], () => {
      console.log(`Subscribe to topic '${topic}'`)
    })
  })

  client.on('message', (topic, payload) => {
    console.log('Received Message:', topic, payload.toString())
  })
  client.on('error', (error) => {
    console.error('Error:', error.message)
  })