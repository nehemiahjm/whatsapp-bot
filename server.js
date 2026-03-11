import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

/*
================================
WEBHOOK VERIFICATION (META)
================================
*/

app.get("/webhook", (req, res) => {

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified successfully");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);

});

/*
================================
RECEIVE WHATSAPP MESSAGES
================================
*/

app.post("/webhook", async (req, res) => {

  try {

    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    const from = message.from;
    const text = message.text?.body?.toLowerCase() || "";

    console.log("Message from user:", text);

    let reply = "";

    if (text === "menu") {

      reply =
`✨ Hisabi Cash Dashboard ✨

Type one of the following:

SALE — record a sale
EXPENSE — record an expense
UDHAR — record customer credit
REPORT — financial report
PLAN — view subscription
MENU — return here`;

    } else {

      reply =
`👋 Welcome to Hisabi Cash

Your AI Financial Assistant

Type:

MENU

to open your dashboard`;

    }

    await sendMessage(from, reply);

    return res.sendStatus(200);

  } catch (error) {

    console.error(error);
    return res.sendStatus(500);

  }

});

/*
================================
SEND MESSAGE FUNCTION
================================
*/

async function sendMessage(to, text) {

  await fetch(
    `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: { body: text },
      }),
    }
  );

}

/*
================================
START SERVER
================================
*/

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});