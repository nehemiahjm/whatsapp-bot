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
    const lang = userLanguage[from] || "english";

  // LANGUAGE SELECTION

if (userText === "1") {

userLanguage[from] = "english";

await sendMessage(from, "Language set to English ✅");

await sendMessage(
from,
`Hisabi Cash helps shopkeepers manage their shop accounts easily.

You can record:
• Sales
• Expenses
• Inventory
• Udhar
• Reports`
);

await sendMessage(
from,
`Choose your plan:

11  Free Trial — 7 Days

22  Monthly Plan
Rs 2499 / month

33  Yearly Plan
Rs 24,990
(2 months free)

Reply with 11, 22 or 33`
);

return res.sendStatus(200);
}



if (userText === "2") {

userLanguage[from] = "roman";

await sendMessage(from, "Zubaan Roman Urdu set ho gayi ✅");

await sendMessage(
from,
`Hisabi Cash shopkeepers ko apni shop ka hisaab asaani se manage karne mein madad karta hai.

Aap record kar sakte hain:
• Sale
• Kharcha
• Inventory
• Udhar
• Reports`
);

await sendMessage(
from,
`Apna plan choose karein:

11  7 Din Free Trial

22  Monthly Plan
Rs 2499 / month

33  Yearly Plan
Rs 24,990
(2 mahine free)

Reply with 11, 22 ya 33`
);

return res.sendStatus(200);
}



if (userText === "3") {

userLanguage[from] = "urdu";

await sendMessage(from, "زبان اردو منتخب کر لی گئی ✅");

await sendMessage(
from,
`حسابی کیش دکانداروں کو اپنی دکان کا حساب آسانی سے سنبھالنے میں مدد دیتا ہے۔

آپ ریکارڈ کر سکتے ہیں:
• سیل
• خرچہ
• انوینٹری
• ادھار
• رپورٹس`
);

await sendMessage(
from,
`اپنا پلان منتخب کریں:

11  سات دن فری ٹرائل

22  ماہانہ پلان
2499 روپے

33  سالانہ پلان
24,990 روپے
(2 مہینے فری)

جو پلان چاہیے اس کا نمبر بھیجیں`
);

return res.sendStatus(200);
}

 // PLAN SELECTION

if (userText === "11") {

const startDate = new Date();
const endDate = new Date();

endDate.setDate(startDate.getDate() + 7);

if (lang === "english") {

await sendMessage(
from,
`Congratulations!

Your 7 Day Free Trial has started.

Start Date: ${startDate.toDateString()}
End Date: ${endDate.toDateString()}`
);

await sendMessage(from, "Type MENU anytime to open the dashboard.");

}

if (lang === "roman") {

await sendMessage(
from,
`Mubarak ho!

Aapka 7 din ka Free Trial shuru ho gaya hai.

Start Date: ${startDate.toDateString()}
End Date: ${endDate.toDateString()}`
);

await sendMessage(from, "Dashboard kholne ke liye MENU likhein.");
}

if (lang === "urdu") {

await sendMessage(
from,
`مبارک ہو!

آپ کا 7 دن کا فری ٹرائل شروع ہو گیا ہے۔

شروع ہونے کی تاریخ: ${startDate.toDateString()}
اختتام کی تاریخ: ${endDate.toDateString()}`
);

await sendMessage(from, "ڈیش بورڈ کھولنے کے لئے MENU لکھیں۔");

}

return res.sendStatus(200);
}



if (userText === "22") {

if (lang === "english") {

await sendMessage(
from,
`Monthly Plan Selected

Send payment via:

JazzCash / Easypaisa
03163154140

Amount: Rs 2499

Send payment screenshot here.`
);

}

if (lang === "roman") {

await sendMessage(
from,
`Monthly Plan select ho gaya hai.

Payment bhejein:

JazzCash / Easypaisa
03163154140

Amount: Rs 2499

Screenshot yahan bhejein.`
);

}

if (lang === "urdu") {

await sendMessage(
from,
`ماہانہ پلان منتخب کر لیا گیا ہے۔

ادائیگی بھیجیں:

JazzCash / Easypaisa
03163154140

رقم: 2499 روپے

اسکرین شاٹ یہاں بھیجیں۔`
);

}

return res.sendStatus(200);
}



if (userText === "33") {

if (lang === "english") {

await sendMessage(
from,
`Yearly Plan Selected

Amount: Rs 24,990

Send payment to:

JazzCash / Easypaisa
03163154140

Send screenshot after payment.`
);

}

if (lang === "roman") {

await sendMessage(
from,
`Yearly Plan select ho gaya hai.

Amount: Rs 24,990

Payment bhejein:

JazzCash / Easypaisa
03163154140

Screenshot bhejein.`
);

}

if (lang === "urdu") {

await sendMessage(
from,
`سالانہ پلان منتخب کر لیا گیا ہے۔

رقم: 24,990 روپے

ادائیگی بھیجیں:

JazzCash / Easypaisa
03163154140

اسکرین شاٹ بھیجیں۔`
);

}

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