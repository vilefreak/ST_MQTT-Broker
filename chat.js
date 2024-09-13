const mqtt = require('mqtt');
const readline = require('readline');

// Configuración de conexión al broker MQTT
const protocol = 'mqtt';
const host = '44.195.13.106'; // Usa la IP elástica
const port = '1883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`; // ID de cliente único

const connectUrl = `${protocol}://${host}:${port}`; // URL de conexión

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

let username = ''; // Para almacenar el nombre de usuario
const topic = 'chat_general'; 


const promptUser = () => {
  rl.question('Introduce tu nombre de usuario: ', (input) => {
    username = input;
    console.log(`Bienvenido, ${username}! Estás en el chat.`);
    
    client.subscribe(topic, () => {
      console.log(`Subscrito al topic '${topic}' para recibir mensajes.`);
    });

    startChat(); 
  });
};

const startChat = () => {
  client.on('connect', () => {
    console.log('Conectado al broker MQTT');
  });

  rl.on('line', (input) => {
    const message = `${username}: ${input}`;
    client.publish(topic, message, { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error('Error al publicar:', error);
      } 
    });
  });

  client.on('message', (topic, payload) => {
    const message = payload.toString();
    
    // Evitar mostrar el propio mensaje
    if (!message.startsWith(`${username}:`)) {
      console.log(message);
    }
  });
  

  client.on('error', (error) => {
    console.error('Error del cliente MQTT:', error.message);
  });

  client.on('reconnect', () => {
    console.log('Intentando reconectar...');
  });
};

promptUser();