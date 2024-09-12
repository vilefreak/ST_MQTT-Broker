const mqtt = require('mqtt');
const readline = require('readline');

// Configuración de la conexión MQTT
const protocol = 'mqtt';
const host = '44.195.13.106'; // Usa la IP elástica
const port = '1883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`; // Genera un ID de cliente único

const connectUrl = `${protocol}://${host}:${port}`; // URL de conexión al broker MQTT

// Conecta al broker MQTT
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'steve',
  password: 'josexo',
  reconnectPeriod: 1000,
});

// Configuración de la interfaz de línea de comandos
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const topic = 'test'; // Tema de comunicación en MQTT

// Maneja la conexión al broker MQTT
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  
  // Suscribe al cliente al tema especificado
  client.subscribe(topic, () => {
    console.log(`Subscribed to topic '${topic}'`);
  });

  // Envía mensajes al broker cuando se recibe input del usuario
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

// Maneja la recepción de mensajes desde el broker
client.on('message', (topic, payload) => {
  console.log(`Received message on topic '${topic}': ${payload.toString()}`);
});

// Maneja errores en el cliente MQTT
client.on('error', (error) => {
  console.error('MQTT Client Error:', error.message);
});