# MQTT Chat Application

Esta es una implementación básica de un chat bidireccional usando el protocolo MQTT. El proyecto fue desarrollado utilizando un **MQTT Broker** alojado en AWS con una **IP elástica** para facilitar la conectividad sin tener que cambiar el código constantemente. La aplicación permite a los usuarios conectarse, suscribirse a un topic y enviar/recibir mensajes en tiempo real desde diferentes dispositivos.

## Características

- **Protocolo MQTT**: Comunicación ligera y eficiente a través de MQTT.
- **Bidireccional**: Combina tanto la funcionalidad de **Publisher** como de **Subscriber** en un solo script.
- **Broker MQTT en AWS**: Se utilizó un broker MQTT implementado en AWS para manejar las conexiones.
- **Autenticación**: El broker requiere credenciales de usuario y contraseña.
- **Multiusuario**: Varios clientes pueden conectarse y participar en el chat desde diferentes máquinas.

## Requisitos

- **Node.js**: Asegúrate de tener instalada la versión más reciente de Node.js.
- **Broker MQTT**: Un broker MQTT que soporte autenticación (en este caso se utilizó AWS IoT con IP elástica).
  
## Instalación

1. Clona el repositorio:
    ```bash
    git clone https://github.com/tuusuario/nombre-del-repo.git
    cd nombre-del-repo
    ```

2. Instala las dependencias:
    ```bash
    npm install mqtt readline
    ```

## Uso

1. **Ejecuta la aplicación**:
    ```bash
    node mqtt-chat.js
    ```

2. Introduce tu nombre de usuario cuando se te solicite.

3. A continuación, podrás enviar y recibir mensajes en el topic general del chat (`chat_general`).

### Ejemplo de Ejecución:

```bash
Introduce tu nombre de usuario: Juan
Bienvenido, Juan! Estás en el chat.
Subscrito al topic 'chat_general' para recibir mensajes.
Conectado al broker MQTT
Puedes chatear en tiempo real con otros usuarios que estén conectados al mismo broker y suscritos al mismo topic.
```

## Broker MQTT en AWS

Se configuró un **Broker MQTT** en **AWS IoT** para manejar las conexiones. Para facilitar el acceso y evitar cambios constantes en el código, se utilizó una **IP elástica** en AWS.

### Configuración de Seguridad
El broker está protegido por credenciales que se deben especificar al realizar la conexión:

- **Usuario**: `steve`
- **Contraseña**: `josexo`

Estas credenciales se configuran en el código:

```javascript
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
