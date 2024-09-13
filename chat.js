const mqtt = require('mqtt');
const readline = require('readline');

// Configuración de conexión al broker MQTT
const protocol = 'mqtt'; // Protocolo MQTT para la conexión
const host = '44.195.13.106'; // IP del broker MQTT
const port = '1883'; // Puerto estándar para conexiones MQTT no seguras
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`; // Genera un ID de cliente único

// Construcción de la URL de conexión utilizando el protocolo, host y puerto
const connectUrl = `${protocol}://${host}:${port}`; 

// Conexión al broker MQTT con credenciales y configuración
const client = mqtt.connect(connectUrl, {
  clientId,               // El ID de cliente único
  clean: true,            // Sesión limpia para este cliente
  connectTimeout: 4000,   // Tiempo de espera de 4 segundos para conectarse
  username: 'steve',      // Usuario para autenticar
  password: 'josexo',     // Contraseña para autenticar
  reconnectPeriod: 1000,  // Intento de reconexión cada 1 segundo en caso de fallo
});

// Configuración de la interfaz de línea de comandos
const rl = readline.createInterface({
  input: process.stdin,  // Entrada del teclado
  output: process.stdout // Salida en la consola
});

let username = ''; // Variable para almacenar el nombre de usuario
const topic = 'chat_general'; // Tema en el que se publica y suscribe el chat

// Función para solicitar al usuario su nombre de usuario
const promptUser = () => {
  rl.question('Introduce tu nombre de usuario: ', (input) => {
    username = input; // Se guarda el nombre de usuario
    console.log(`Bienvenido, ${username}! Estás en el chat.`); // Bienvenida

    // Suscribirse al tema general de chat
    client.subscribe(topic, () => {
      console.log(`Subscrito al topic '${topic}' para recibir mensajes.`);
    });

    // Iniciar la función principal de chat
    startChat();
  });
};

// Función que maneja la conexión, envío y recepción de mensajes
const startChat = () => {
  // Evento cuando el cliente se conecta al broker
  client.on('connect', () => {
    console.log('Conectado al broker MQTT');
  });

  // Captura cada línea que el usuario escribe en la consola
  rl.on('line', (input) => {
    const message = `${username}: ${input}`; // Formato del mensaje con el nombre del usuario
    client.publish(topic, message, { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error('Error al publicar:', error); // Si ocurre un error al enviar el mensaje
      } 
    });
  });

  // Evento cuando se recibe un mensaje en el tema suscrito
  client.on('message', (topic, payload) => {
    const message = payload.toString(); // Convierte el mensaje en cadena de texto
    
    // Si el mensaje no es del propio usuario, lo muestra en la consola
    if (!message.startsWith(`${username}:`)) {
      console.log(message); // Muestra los mensajes de otros usuarios
    }
  });
  
  // Maneja errores de conexión con el broker
  client.on('error', (error) => {
    console.error('Error del cliente MQTT:', error.message); // Muestra el error si ocurre
  });

  // Evento cuando el cliente intenta reconectar
  client.on('reconnect', () => {
    console.log('Intentando reconectar...'); // Mensaje cuando se intenta reconectar
  });
};

// Llama a la función para solicitar el nombre de usuario e iniciar el chat
promptUser();
