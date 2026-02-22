const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

const QRCode = require('qrcode');

client.on('qr', async (qr) => {
    console.log("QR RECEIVED");
    
    const url = await QRCode.toDataURL(qr);
    console.log("Scan this QR code:");
    console.log(url);
});

client.on('ready', () => {
    console.log('Bot is ready!');
});

client.on('message', message => {
    console.log("Message received: " + message.body);

    if(message.body.toLowerCase() === "hi"){
        message.reply("Hello 👋 How can I help you today?");
    }
});

client.initialize();