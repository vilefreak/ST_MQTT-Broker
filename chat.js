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
const topic = 'chat_general'; // Topic común para todos los usuarios

// Función para solicitar el nombre de usuario y configurar el chat
const promptUser = () => {
  rl.question('Introduce tu nombre de usuario: ', (input) => {
    username = input;
    console.log(`Bienvenido, ${username}! Estás en el chat.`);
    
    // Conectar al broker y suscribirse al topic común
    client.subscribe(topic, () => {
      console.log(`Subscrito al topic '${topic}' para recibir mensajes.`);
    });

    startChat(); // Iniciar el chat
  });
};

// Configura el cliente para enviar y recibir mensajes
const startChat = () => {
  client.on('connect', () => {
    console.log('Conectado al broker MQTT');
  });

  // Cuando el usuario escribe un mensaje, lo publica en el topic común
  rl.on('line', (input) => {
    const message = `${username}: ${input}`;
    client.publish(topic, message, { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error('Error al publicar:', error);
      } 
    });
  });

  // Maneja la recepción de mensajes desde el broker
  client.on('message', (topic, payload) => {
    console.log(`${payload.toString()}`);
  });

  // Maneja errores en el cliente MQTT
  client.on('error', (error) => {
    console.error('Error del cliente MQTT:', error.message);
  });

  client.on('reconnect', () => {
    console.log('Intentando reconectar...');
  });
};

// Inicia el proceso solicitando el nombre de usuario
promptUser();