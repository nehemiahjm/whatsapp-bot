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

    const value = req.body.entry?.[0]?.changes?.[0]?.value;

if (!value.messages) {
  return res.sendStatus(200);
}

const message = value.messages[0];

if (message.from === value.metadata.display_phone_number) {
return res.sendStatus(200);
}

    const from = message.from;
    const text = message.text.body;

    console.log("User:", from);
    console.log("Message:", text);

    const userText = text.toLowerCase();

   // LANGUAGE SELECTION

if (userText === "1") {

  await sendMessage(from, "Language set to English ✅");

  await sendMessage(
    from,
    "Hisabi Cash helps shopkeepers manage their shop accounts easily.\n\nYou can record:\n• Sales\n• Expenses\n• Inventory\n• Udhar\n• Reports"
  );

  await sendMessage(
    from,
    "Choose your plan:\n\n11️⃣ 7 Day Free Trial\n22️⃣ Monthly Plan – Rs 2499 / month\n33️⃣ Yearly Plan – Rs 24,990 (2 months free)"
  );

  return res.sendStatus(200);
}


if (userText === "2") {

  await sendMessage(from, "Zubaan Roman Urdu set ho gayi ✅");

  await sendMessage(
    from,
    "Hisabi Cash shopkeepers ko apni shop ka hisaab aasani se manage karne mein madad karta hai.\n\nAap record kar sakte hain:\n• Sale\n• Kharcha\n• Inventory\n• Udhar\n• Reports"
  );

  await sendMessage(
    from,
    "Apna plan choose karein:\n\n11️⃣ 7 Din Free Trial\n22️⃣ Monthly Plan – Rs 2499 / month\n33️⃣ Yearly Plan – Rs 24,990 (2 mahine free)"
  );

  return res.sendStatus(200);
}


if (userText === "3") {

  await sendMessage(from, "زبان اردو منتخب کر لی گئی ✅");

  await sendMessage(
    from,
    "حسابی کیش دکانداروں کو اپنی دکان کا حساب آسانی سے منظم کرنے میں مدد دیتا ہے۔\n\nآپ یہ ریکارڈ کر سکتے ہیں:\n• سیلز\n• اخراجات\n• انوینٹری\n• ادھار\n• رپورٹس"
  );

  await sendMessage(
    from,
    "اپنا پلان منتخب کریں:\n\n11️⃣ 7 دن فری ٹرائل\n22️⃣ ماہانہ پلان – 2499 روپے / ماہ\n33️⃣ سالانہ پلان – 24,990 روپے (2 ماہ فری)"
  );

  return res.sendStatus(200);
}

  // PLAN SELECTION

if (userText === "11") {

  const startDate = new Date();
  const endDate = new Date();

  endDate.setDate(startDate.getDate() + 7);

  await sendMessage(
    from,
    `🎉 Congratulations!\n\nYour 7 Day Free Trial has started.\n\nStart Date: ${startDate.toDateString()}\nEnd Date: ${endDate.toDateString()}`
  );

  await sendMessage(
    from,
    "Type *menu* anytime to open the dashboard."
  );

  return res.sendStatus(200);
}


if (userText === "22") {

  await sendMessage(
    from,
    "Monthly Plan Selected ✅\n\nPlease send payment via:\n\nJazzCash / Easypaisa\n03163154140\n\nSteps:\n1️⃣ Send Rs 2499\n2️⃣ Take screenshot of transaction\n3️⃣ Send screenshot in this chat\n\nOur team will verify within 12–24 hours."
  );

  return res.sendStatus(200);
}


if (userText === "33") {

  await sendMessage(
    from,
    "Yearly Plan Selected ✅\n\nPlease send payment via:\n\nJazzCash / Easypaisa\n03163154140\n\nSteps:\n1️⃣ Send Rs 24,990\n2️⃣ Take screenshot of transaction\n3️⃣ Send screenshot in this chat\n\nOur team will verify within 12–24 hours."
  );

  return res.sendStatus(200);
}

// MENU COMMAND

if (userText === "menu") {

  await sendMessage(
    from,
    `📊 Hisabi Cash Dashboard

1️⃣ Record Sale
2️⃣ Record Expense
3️⃣ Inventory
4️⃣ Reports
5️⃣ Subscription
6️⃣ Change Language

Type the number of the option you want.`
  );

  return res.sendStatus(200);
}

// GREETING COMMAND

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
    `Choose your language:

1️⃣ English
2️⃣ Roman Urdu
3️⃣ اردو`
  );

  return res.sendStatus(200);
}



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