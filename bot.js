const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
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