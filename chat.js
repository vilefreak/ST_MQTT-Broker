const mqtt = require('mqtt');
const readline = require('readline');

// Configuración de la conexión MQTT
const protocol = 'mqtt';
const host = '44.195.13.106'; // IP elástica
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
let username = ''; // Nombre de usuario para el chat

// Solicita al usuario su nombre y luego inicia el chat
const promptUser = () => {
  rl.question('Usuario: ', (input) => {
    username = input;
    console.log(`Bienvenido, ${username}! Ahora puedes comenzar a chatear.`);
    startChat();
  });
};

// Configura el cliente MQTT para enviar y recibir mensajes
const startChat = () => {
  // Maneja la conexión al broker MQTT
  client.on('connect', () => {
    console.log('Conectado a MQTT broker');
    client.subscribe(topic, () => {
      console.log(`Subscrito al topic '${topic}'`);
    });
  });

  // Envía mensajes al broker cuando se recibe input del usuario
  rl.on('line', (input) => {
    const message = `${username}: ${input}`;
    client.publish(topic, message, { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error('Error al publicar:', error);
      } else {
        console.log(`Mensaje enviado al topic '${topic}': ${message}`);
      }
    });
  });

  // Maneja la recepción de mensajes desde el broker
  client.on('message', (topic, payload) => {
    console.log(`Mensaje recibido en el topic '${topic}': ${payload.toString()}`);
  });

  // Maneja errores en el cliente MQTT
  client.on('error', (error) => {
    console.error('Error del cliente MQTT:', error.message);
  });

  // Notifica cuando el cliente está intentando reconectar
  client.on('reconnect', () => {
    console.log('Intentando reconectar al broker MQTT...');
  });
};

// Inicia la solicitud del nombre de usuario
promptUser();

// Esta es la base para que podamos hacer como si fueran 2 usuarios chateando, pero me aparece bien en el MQTT Broker, 
// pero no me aparece bien en la terminal, solo me aparecen por separado, a ver si podemos arreglar eso con el profe
// o durante el dia :) 