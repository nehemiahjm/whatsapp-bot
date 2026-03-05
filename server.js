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

if (message.from === value.metadata.phone_number_id) {
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
    "Choose your plan:\n\n1️⃣ 7 Day Free Trial\n2️⃣ Monthly Plan – Rs 2499 / month\n3️⃣ Yearly Plan – Rs 24,990 (2 months free)"
  );

}

if (userText === "2") {

  await sendMessage(from, "Zubaan Roman Urdu set ho gayi ✅");

  await sendMessage(
    from,
    "Hisabi Cash shopkeepers ko apni shop ka hisaab asaani se manage karne mein madad karta hai.\n\nAap record kar sakte hain:\n• Sale\n• Kharcha\n• Inventory\n• Udhar\n• Reports"
  );

  await sendMessage(
    from,
    "Apna plan choose karein:\n\n1️⃣ 7 Din Free Trial\n2️⃣ Monthly Plan – Rs 2499 / month\n3️⃣ Yearly Plan – Rs 24,990 (2 mahine free)"
  );

}

if (userText === "3") {

  await sendMessage(from, "زبان اردو منتخب کر لی گئی ✅");

  await sendMessage(
    from,
    "حصابی کیش دکانداروں کو اپنی دکان کا حساب آسانی سے منظم کرنے میں مدد دیتا ہے۔\n\nآپ ریکارڈ کر سکتے ہیں:\n• سیلز\n• خرچہ\n• انوینٹری\n• ادھار\n• رپورٹس"
  );

  await sendMessage(
    from,
    "اپنا پلان منتخب کریں:\n\n1️⃣ 7 دن فری ٹرائل\n2️⃣ ماہانہ پلان – 2499 روپے\n3️⃣ سالانہ پلان – 24,990 روپے (2 مہینے فری)"
  );

  // PLAN SELECTION

if (userText === "1") {

const startDate = new Date();
const endDate = new Date();

endDate.setDate(startDate.getDate() + 7);

await sendMessage(
from,
`🎉 Congratulations!\n\nYour 7 Day Free Trial has started.\n\nStart Date: ${startDate.toDateString()}\nEnd Date: ${endDate.toDateString()}`
);
await sendMessage(
from,
`Type *menu* anytime to open the dashboard.`
);

return res.sendStatus(200);
}

if (userText === "2") {

await sendMessage(
from,
`Monthly Plan Selected ✅

Please send payment via:

JazzCash / Easypaisa
03163154140

Steps:
1️⃣ Send Rs 2499
2️⃣ Take screenshot of transaction
3️⃣ Send screenshot in this chat

Our team will verify within 12-24 hours and activate your account.`
);
return res.sendStatus(200);
}

if (userText === "3") {

await sendMessage(
from,
`Yearly Plan Selected ✅

Please send payment via:

JazzCash / Easypaisa
03163154140

Steps:
1️⃣ Send Rs 24,990
2️⃣ Take screenshot of transaction
3️⃣ Send screenshot here

Your access will be activated within 12-24 hours after verification.`
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
6️⃣ Change Language`
);

return res.sendStatus(200);

}
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