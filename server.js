require("dotenv").config();

const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

app.get("/", (req, res) => {
  res.send("Hisabi Cash Bot Running ✅");
});

app.get("/webhook", (req, res) => {

  const verify_token = "hisabi_verify_token";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === verify_token) {
    console.log("Webhook Verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }

});

app.post("/webhook", async (req, res) => {
  try {

    const message =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message || message.type !== "text") {
  return res.sendStatus(200);
    }

    const from = message.from;
    const text = message.text.body;

    console.log("User:", from);
    console.log("Message:", text);

    const userText = text.toLowerCase();

    // LANGUAGE SELECTION

if (text === "1") {
  await sendMessage(from, "Language set to English ✅");
}

if (text === "2") {
  await sendMessage(from, "Zubaan Roman Urdu set ho gayi ✅");
}

if (text === "3") {
  await sendMessage(from, "زبان اردو منتخب کر لی گئی ✅");
}

if (
  userText.includes("hi") ||
  userText.includes("hello") ||
  userText.includes("salam") ||
  userText.includes("assalam") ||
  userText.includes("start")
) {

  await sendMessage(from, "Welcome to Hisabi Cash 💰");

  await sendMessage(
    from,
    "Choose your language:\n\n1️⃣ English\n2️⃣ Roman Urdu\n3️⃣ اردو"
  );

}

    res.sendStatus(200);

  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

async function sendMessage(to, text) {

  await axios.post(
    `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body: text }
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );

}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});