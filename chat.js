const mqtt = require('mqtt');
const readline = require('readline');

const protocol = 'mqtt';
const host = '44.195.13.106'; // Use the elastic IP
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

let topicSub;
let topicPub;

rl.question('Enter the topic to subscribe: ', (subscriptionTopic) => {
  topicSub = subscriptionTopic;
  rl.question('Enter the topic to publish: ', (publicationTopic) => {
    topicPub = publicationTopic;

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe(topicSub, () => {
        console.log(`Subscribed to topic '${topicSub}'`);
      });

      rl.on('line', (input) => {
        client.publish(topicPub, input, { qos: 0, retain: false }, (error) => {
          if (error) {
            console.error('Publish error:', error);
          } else {
            console.log(`Message sent to topic '${topicPub}': ${input}`);
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
  });
});
