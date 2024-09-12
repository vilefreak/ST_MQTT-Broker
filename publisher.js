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
  const topic = 'test'
  const message = 'Hello from publisher'
  
  client.publish(topic, message, { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error('Publish error:', error)
    } else {
      console.log(`Message sent to topic '${topic}'`)
    }
  })
})

client.on('error', (error) => {
  console.error('Error:', error.message)
})
