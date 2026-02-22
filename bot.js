const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const OpenAI = require("openai");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
pool.connect()
  .then(() => console.log("✅ Database Connected"))
  .catch(err => console.error("❌ DB Connection Error:", err));
  pool.query(`
  CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`)
.then(() => console.log("✅ Transactions Table Ready"))
.catch(err => console.error("❌ Table Error:", err));
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
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

client.on("message", async (message) => {
  if (message.fromMe) return;

  const userMessage = message.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
{
  role: "system",
  content: `
You are Hisabi Cash AI, a smart financial assistant.
You ONLY answer questions related to:
- Accounting
- Business
- Finance
- Profit & Loss
- Revenue
- Gross Margin
- EMI calculations
- Budgeting
- Investment math
- Financial analysis

If question is unrelated to finance, politely refuse.
Always calculate properly and explain clearly.
`,
},
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const reply = response.choices?.[0]?.message?.content || 
"Sorry, I couldn't generate a response.";

    message.reply(reply);

  } catch (error) {
    console.error(error);
    message.reply("⚠️ Error processing request. Please try again.");
  }
});

client.initialize();