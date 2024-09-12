const mqtt = require('mqtt');
const readline = require('readline');

const protocol = 'mqtt';
const host = '44.195.13.106'; // Usa la IP elástica
const port = '1883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `${protocol}://${host}:${port}`;

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'steve',
  password: 'josexo',
  reconnectPeriod: 1000,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const topic = 'test';

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(topic, () => {
    console.log(`Subscribed to topic '${topic}'`);
  });

  rl.on('line', (input) => {
    client.publish(topic, input, { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error('Publish error:', error);
      } else {
        console.log(`Message sent to topic '${topic}': ${input}`);
      }
    });
  });
});

client.on('message', (topic, payload) => {
  console.log(`Received message on topic '${topic}': ${payload.toString()}`);
});

client.on('error', (error) => {
  console.error('MQTT Client Error:', error.message);
});