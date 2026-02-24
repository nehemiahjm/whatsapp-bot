const fs = require("fs");

if (fs.existsSync("/data/session")) {
  fs.rmSync("/data/session", { recursive: true, force: true });
  console.log("Old WhatsApp session deleted.");
}
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
pool.query(`
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL,
    language TEXT DEFAULT 'en',
    first_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`)
.then(() => console.log("✅ Users Table Ready"))
.catch(err => console.error("❌ Users Table Error:", err));
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: '/data/session'
  }),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
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

  const userId = message.from;

  // CHECK OR CREATE USER
  const userCheck = await pool.query(
    "SELECT * FROM users WHERE user_id = $1",
    [userId]
  );

  if (userCheck.rows.length === 0) {
    await pool.query(
      "INSERT INTO users (user_id) VALUES ($1)",
      [userId]
    );

    return message.reply(
`Welcome to Hisabi Cash 💼

Choose Language:

1️⃣ English
2️⃣ Roman Urdu
3️⃣ اردو`
    );
  }

  const userMessage = message.body;
  // FORCE LANGUAGE MENU ON GREETING
// PREMIUM MENU ON GREETING
if (
  userMessage.toLowerCase() === "hi" ||
  userMessage.toLowerCase() === "hello" ||
  userMessage.toLowerCase() === "start" ||
  userMessage.toLowerCase() === "menu" ||
  userMessage.toLowerCase() === "assalamualaikum"
) {

  // GET USER LANGUAGE
  const langCheck = await pool.query(
      "SELECT language FROM users WHERE user_id = $1",
      [userId]
  );

  let currentLang = "en";

  if (langCheck.rows.length > 0) {
      currentLang = langCheck.rows[0].language || "en";
  }

  if (currentLang === "en") {
      return message.reply(
`💰 Welcome to Hisabi Cash

How can I help today?

1️⃣ Add Sale  
2️⃣ Add Expense  
3️⃣ Check Profit  
4️⃣ Today's Report  
5️⃣ Help  

Or type directly:
Sale 5000 shoes`
      );
  }

  if (currentLang === "roman") {
      return message.reply(
`💰 Hisabi Cash mein khush aamdeed

Aaj kya karna hai?

1️⃣ Sale add karein  
2️⃣ Expense add karein  
3️⃣ Profit check karein  
4️⃣ Aaj ki report  
5️⃣ Madad  

Ya seedha likhein:
Sale 5000 shoes`
      );
  }

  if (currentLang === "urdu") {
      return message.reply(
`💰 حسابی کیش میں خوش آمدید

آج کیا کرنا ہے؟

1️⃣ سیل شامل کریں  
2️⃣ خرچ شامل کریں  
3️⃣ منافع چیک کریں  
4️⃣ آج کی رپورٹ  
5️⃣ مدد  

یا سیدھا لکھیں:
Sale 5000 shoes`
      );
  }
}
  // LANGUAGE SELECTION
if (userMessage === "1" || userMessage === "2" || userMessage === "3") {

    let selectedLang = "en";

    if (userMessage === "1") selectedLang = "en";
    if (userMessage === "2") selectedLang = "roman";
    if (userMessage === "3") selectedLang = "urdu";

    await pool.query(
        "UPDATE users SET language = $1 WHERE user_id = $2",
        [selectedLang, userId]
    );

    return message.reply("Language updated successfully ✅");
}
const parts = userMessage.trim().toLowerCase().split(" ");

if (parts[0] === "sale" || parts[0] === "expense") {
    const type = parts[0];
    const amount = parseFloat(parts[1]);
    const description = parts.slice(2).join(" ");

    if (isNaN(amount)) {
        return message.reply("❌ Please enter valid amount. Example: sale 5000 shoes");
    }

    try {
        await pool.query(
            "INSERT INTO transactions (user_id, type, amount, description) VALUES ($1, $2, $3, $4)",
            [userId, type, amount, description]
        );

        // GET USER LANGUAGE
const langCheck = await pool.query(
    "SELECT language FROM users WHERE user_id = $1",
    [userId]
);

let userLanguage = "en";

if (langCheck.rows.length > 0) {
    userLanguage = langCheck.rows[0].language || "en";
}

if (userLanguage === "en")
    return message.reply(`${type} of ${amount} saved ✅`);

if (userLanguage === "roman")
    return message.reply(`${type} ${amount} save ho gayi ✅`);

if (userLanguage === "urdu")
    return message.reply(`${type} ${amount} محفوظ ہو گئی ✅`);
    } catch (err) {
        console.error(err);
        return message.reply("❌ Failed to save transaction.");
    }
}
  try {
    // GET USER LANGUAGE FOR AI RESPONSE
const langCheckAI = await pool.query(
    "SELECT language FROM users WHERE user_id = $1",
    [userId]
);

let aiLanguage = "en";

if (langCheckAI.rows.length > 0) {
    aiLanguage = langCheckAI.rows[0].language || "en";
}
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
{
  role: "system",
  content: `
  If aiLanguage is "en", respond in simple English.
If aiLanguage is "roman", respond in Roman Urdu.
If aiLanguage is "urdu", respond in proper Urdu script.

Current language: ${aiLanguage}.
Keep answers short and simple.
Be precise.
Only give details if asked.
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