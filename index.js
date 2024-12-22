const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const axios = require('axios');
const path = require('path');

// Inicializar cliente de WhatsApp
const client = new Client();

client.on('qr', async (qr) => {
    try {
        // Convertir el código QR en una imagen base64 sin márgenes
        const qrcodeData = await qrcode.toDataURL(qr, { margin: 1 });

        // Enviar el código QR al servidor Flask
        await axios.post('http://127.0.0.1:5000/api/qrcode', { qrcode: qrcodeData });

        console.log('QR enviado a Flask correctamente');
    } catch (error) {
        console.error('Error al enviar el código QR a Flask:', error);
    }
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

// Inicializar cliente de WhatsApp
client.initialize();