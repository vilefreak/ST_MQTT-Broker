const mqtt = require('mqtt');
const readline = require('readline');

const protocol = 'mqtt';
const host = '3.82.100.202'; // Asegúrate de usar la IP correcta
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

client.on('connect', () => {
  console.log('Connected');
  rl.setPrompt('Enter message: ');
  rl.prompt();
});

client.on('error', (error) => {
  console.error('Error:', error.message);
});

rl.on('line', (line) => {
  const topic = 'test';
  client.publish(topic, line, { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error('Publish error:', error);
    } else {
      console.log(`Message sent to topic '${topic}': ${line}`);
    }
  });
  rl.prompt();
});