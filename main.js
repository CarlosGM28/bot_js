const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

const client = new Client();

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Cliente de WhatsApp está listo.');
});

client.on('message', async (message) => {
    console.log(`Mensaje recibido: ${message.body}`);

    // Capturar el número del usuario
    const userId = message.from.split('@')[0]; // Número de teléfono sin el dominio '@c.us'

    // Enviar la pregunta a la API Flask
    try {
        const response = await axios.post('http://127.0.0.1:5000/api/chat', {
            pregunta: message.body,
            user_id: userId,
        });

        const respuesta = response.data.respuesta || 'No se pudo procesar tu solicitud.';
        message.reply(respuesta);
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        message.reply('Hubo un error al procesar tu mensaje. Inténtalo nuevamente más tarde.');
    }
});

client.initialize();