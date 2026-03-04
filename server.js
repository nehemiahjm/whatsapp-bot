require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

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

      console.log("User:", from);
      console.log("Message:", userMessage);

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

  let user = userResult.rows[0];
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