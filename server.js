require("dotenv").config();
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