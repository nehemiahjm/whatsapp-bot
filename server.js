require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
const paymentMessages = {

english: `💳 Subscription Payment

To activate your subscription please send payment to this number using:

• JazzCash
• EasyPaisa

📱 Payment Number:
03163154140

Plans:

Monthly Plan
Rs 2499 / month

Yearly Plan
Rs 24,990 / year
(Save 2 Months)

After making the payment:

1️⃣ Take a screenshot of the payment receipt  
2️⃣ Send the screenshot in this chat

Our team will verify your payment within 24 hours.

Once verified, your access will be activated.

⚠️ Disclaimer:
Please send payment only to the number mentioned above.`,

roman_urdu: `💳 Subscription Payment

Apni subscription activate karne ke liye payment is number par bhejein:

• JazzCash
• EasyPaisa

📱 Payment Number:
03163154140

Plans:

Monthly Plan
Rs 2499 / month

Yearly Plan
Rs 24,990 / saal
(2 mahine free)

Payment karne ke baad:

1️⃣ Payment ka screenshot lein  
2️⃣ Isi chat mein screenshot bhej dein

Hamari team 24 ghanton ke andar payment verify karegi.

Verification ke baad aapka access activate kar diya jayega.`,

urdu: `💳 سبسکرپشن ادائیگی

اپنی سبسکرپشن فعال کرنے کے لیے اس نمبر پر ادائیگی کریں:

• جاز کیش
• ایزی پیسہ

📱 ادائیگی نمبر:
03163154140

پلانز:

ماہانہ پلان
2499 روپے فی مہینہ

سالانہ پلان
24,990 روپے فی سال
(2 ماہ مفت)

ادائیگی کرنے کے بعد:

1️⃣ رسید کا اسکرین شاٹ لیں  
2️⃣ اسی چیٹ میں اسکرین شاٹ بھیج دیں

ہماری ٹیم 24 گھنٹوں میں ادائیگی کی تصدیق کرے گی۔

تصدیق کے بعد آپ کی رسائی فعال کر دی جائے گی۔`
};
const messages = {
  english: {
    intro: `Hisabi Cash helps you manage your shop easily.

You can record:
• Sales
• Expenses
• Inventory
• Udhaar
• Reports`,

    plans: `📦 Choose Your Plan

1️⃣ 7 Days Free Trial

2️⃣ Monthly Plan
Rs 2499 / month

3️⃣ Yearly Plan
Rs 24,990
(Save 2 Months)`
  },

  roman_urdu: {
    intro: `Hisabi Cash aapki shop ka hisaab asaani se manage karta hai.

Aap record kar sakte hain:
• Sale
• Kharcha
• Inventory
• Udhaar
• Reports`,

    plans: `📦 Apna Plan Choose Karein

1️⃣ 7 Din Free Trial

2️⃣ Monthly Plan
Rs 2499 / month

3️⃣ Yearly Plan
Rs 24,990
(2 Mahinay Free)`
  },

  urdu: {
    intro: `حسابی کیش آپ کی دکان کا حساب آسانی سے منظم کرتا ہے۔

آپ ریکارڈ کر سکتے ہیں:
• سیلز
• اخراجات
• انوینٹری
• ادھار
• رپورٹس`,

   plans: `📦 اپنا پلان منتخب کریں

1️⃣ سات دن کا فری ٹرائل

2️⃣ ماہانہ پلان
2499 روپے / مہینہ

3️⃣ سالانہ پلان
24,990 روپے
(دو ماہ مفت)`
  }
};

async function initDB() {
  try {
    await pool.query(`
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  language VARCHAR(20),
  state VARCHAR(50) DEFAULT 'new_user',
  plan VARCHAR(20),
  trial_start TIMESTAMP,
  trial_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'users_phone_unique'
        ) THEN
          ALTER TABLE users
          ADD CONSTRAINT users_phone_unique UNIQUE (phone);
        END IF;
      END
      $$;
    `);

    console.log("Users table ready ✅");
  } catch (err) {
    console.error("DB Init Error:", err);
  }
}

initDB();
const express = require("express");

const app = express();
app.use(express.json());

/*
==================================
  WEBHOOK VERIFICATION (META)
==================================
*/

app.get("/webhook", (req, res) => {
  const verify_token = "hisabi_verify_token";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === verify_token) {
      console.log("Webhook verified ✅");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

/*
==================================
  ROOT ROUTE
==================================
*/

app.get("/", (req, res) => {
  res.send("Hisabi Cloud API Running 🚀");
});

/*
==================================
  RECEIVE MESSAGES
==================================
*/

app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    if (
      body.object &&
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages
    ) {
      const message = body.entry[0].changes[0].value.messages[0];
      const from = message.from;
      const userMessage = message.text?.body;
      await pool.query(
"INSERT INTO users (phone) VALUES ($1) ON CONFLICT (phone) DO NOTHING",
[from]
);

const userResult = await pool.query(
"SELECT * FROM users WHERE phone = $1",
[from]
);

const user = userResult.rows[0];
      if (userMessage.toLowerCase() === "language") {

  await sendMessage(from,
`Choose your language:

1 English
2 Roman Urdu
3 Urdu`
  );
// PLAN SELECTION
if (user && user.state === "choose_plan") {

if (userMessage === "1") {

const trialStart = new Date();
const trialEnd = new Date();
trialEnd.setDate(trialEnd.getDate() + 7);

await pool.query(
`UPDATE users
SET plan = $1,
trial_start = $2,
trial_end = $3,
state = $4
WHERE phone = $5`,
["trial", trialStart, trialEnd, "active_user", from]
);

await sendMessage(from,
`✅ Your 7 Day Free Trial is activated!

You now have full access to Hisabi Cash.

Type *menu* to open your dashboard.`);

return res.sendStatus(200);
}

if (userMessage === "2" || userMessage === "3") {

const lang = user.language || "english";

await sendMessage(from, paymentMessages[lang]);

return res.sendStatus(200);
}

}
  await pool.query(
    "UPDATE users SET state = $1 WHERE phone = $2",
    ["choosing_language", from]
  );

  return res.sendStatus(200);
}
if (user.state === "choose_plan") {

  if (userMessage === "1") {

    const trialStart = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);

    await pool.query(
      `UPDATE users
       SET plan = $1,
           trial_start = $2,
           trial_end = $3,
           state = $4
       WHERE phone = $5`,
      ["trial", trialStart, trialEnd, "active_user", from]
    );

    await sendMessage(from,
`✅ Your 7 Day Free Trial is activated!

You now have full access to Hisabi Cash.

Type *menu* to open your dashboard.`);

    return res.sendStatus(200);
  }

}

      console.log("User:", from);
      console.log("Message:", userMessage);
      // MENU COMMAND
if (userMessage && userMessage.toLowerCase() === "menu") {

  const lang = user.language || "english";

  const menuMessages = {
    english: `📊 Hisabi Cash Dashboard

1️⃣ sale [amount] [item]
Example: sale 500 chai

2️⃣ expense [amount] [item]
Example: expense 200 milk

3️⃣ inventory [item] [quantity]
Example: inventory sugar 5

4️⃣ udhaar [name] [amount]
Example: udhaar ali 1000

5️⃣ report
Example: report today

Type *menu* anytime to see this again.`,

    roman_urdu: `📊 Hisabi Cash Dashboard

1️⃣ sale [amount] [item]
Misal: sale 500 chai

2️⃣ expense [amount] [item]
Misal: expense 200 milk

3️⃣ inventory [item] [quantity]
Misal: inventory sugar 5

4️⃣ udhaar [name] [amount]
Misal: udhaar ali 1000

5️⃣ report
Misal: report today

Dobara dekhne ke liye *menu* likhein.`,

    urdu: `📊 ہسابی کیش ڈیش بورڈ

1️⃣ فروخت [رقم] [آئٹم]
مثال: فروخت 500 چائے

2️⃣ خرچ [رقم] [آئٹم]
مثال: خرچ 200 دودھ

3️⃣ انوینٹری [آئٹم] [مقدار]
مثال: انوینٹری چینی 5

4️⃣ ادھار [نام] [رقم]
مثال: ادھار علی 1000

5️⃣ رپورٹ
مثال: رپورٹ آج

مینو دوبارہ دیکھنے کے لیے *menu* لکھیں۔`
  };

  await sendMessage(from, menuMessages[lang]);

  return res.sendStatus(200);
}

      // AUTO REPLY
     try {
  await pool.query(
    "INSERT INTO users (phone) VALUES ($1) ON CONFLICT (phone) DO NOTHING",
    [from]
  );
  const userResult = await pool.query(
"SELECT * FROM users WHERE phone = $1",
[from]
);

const user = userResult.rows[0];
if (!user || user.state === "new_user") {

  await sendMessage(from,
`Welcome to Hisabi Cash 💰

Choose your language:

1 English
2 Roman Urdu
3 Urdu`
  );

  await pool.query(
    "UPDATE users SET state = $1 WHERE phone = $2",
    ["choosing_language", from]
  );

  return res.sendStatus(200);
}
if (user && user.state === "choosing_language") {

  let language;

  if (userMessage === "1") language = "english";
  else if (userMessage === "2") language = "roman_urdu";
  else if (userMessage === "3") language = "urdu";
  else {
    await sendMessage(from, "Please reply with 1, 2, or 3 to choose language.");
    return res.sendStatus(200);
  }

  await pool.query(
    "UPDATE users SET language = $1, state = $2 WHERE phone = $3",
    [language, "choose_plan", from]
  );
  const updatedUserResult = await pool.query(
"SELECT * FROM users WHERE phone = $1",
[from]
);

const updatedUser = updatedUserResult.rows[0];

  await sendMessage(from, messages[language].intro);
  await sendMessage(from, messages[language].plans);
  return res.sendStatus(200);
}
} catch (dbError) {
  console.error("DB Insert Error:", dbError.message);
}
// Always reply even if DB fails
      await sendMessage(from, "Welcome to Hisabi Cash 💰");

    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
  }
});
const axios = require("axios");

async function sendMessage(to, text) {
  await axios.post(
    `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body: text },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});