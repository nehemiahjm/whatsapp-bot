require("dotenv").config();

const express = require("express");
const { sendMessage } = require("./whatsapp");

const app = express();
app.use(express.json());

/* MEMORY STORAGE */

// memory stores
const userLanguage = {};
const userState = {};
const userData = {};

/* ROOT */

app.get("/", (req, res) => {
  res.send("Hisabi Cash Bot Running ✅");
});

/* WEBHOOK VERIFICATION */

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

/* MAIN BOT */

app.post("/webhook", async (req, res) => {

try {

const value = req.body.entry?.[0]?.changes?.[0]?.value;

if (!value.messages) return res.sendStatus(200);

const message = value.messages[0];

if (message.from === value.metadata.display_phone_number) {
return res.sendStatus(200);
}

const from = message.from;
const text = message.text?.body || "";
const userText = text.toLowerCase();

const lang = userLanguage[from] || "english";

console.log("User:", from);
console.log("Message:", text);



/* GREETING */

if (
userText.includes("hi") ||
userText.includes("hello") ||
userText.includes("salam") ||
userText.includes("assalam") ||
userText.includes("start")
) {

await sendMessage(from, `👋 *Welcome to Hisabi Cash*

━━━━━━━━━━━━━━━

🌐 *Please select your preferred language*

1️⃣ English  
2️⃣ Roman Urdu  
3️⃣ اردو

Reply with *1, 2, or 3* to continue.`)

return res.sendStatus(200)

}

/* LANGUAGE COMMAND */

if(userText === "language"){

await sendMessage(from, `🌐 *Language Settings*

Choose your language:

1️⃣ English  
2️⃣ Roman Urdu  
3️⃣ اردو`)

return res.sendStatus(200)

}

/* LANGUAGE SELECTION */

if(userText === "1"){

userLanguage[from] = "english"
userState[from] = "purpose"

await sendMessage(from,"✅ Language set to English.")

await sendMessage(from,`💼 *About Hisabi Cash*

Hisabi Cash helps you manage your money easily.

You can:

• Track sales  
• Record expenses  
• Manage udhar / khata  
• Monitor spending  
• Generate reports`)

await sendMessage(from,`🚀 *Getting Started*

How will you use Hisabi Cash?

Type:

PERSONAL  
BUSINESS`)

return res.sendStatus(200)

}

if(userText === "2"){

userLanguage[from] = "roman"
userState[from] = "purpose"

await sendMessage(from,"✅ Zubaan Roman Urdu set ho gayi.")

await sendMessage(from,`💼 Hisabi Cash aapka WhatsApp financial assistant hai.`)

await sendMessage(from,`🚀 Setup shuru karein

PERSONAL  
BUSINESS`)

return res.sendStatus(200)

}

if(userText === "3"){

userLanguage[from] = "urdu"
userState[from] = "purpose"

await sendMessage(from,"✅ زبان اردو منتخب ہو گئی۔")

await sendMessage(from,`💼 حسابی کیش آپ کا مالی معاون ہے جو واٹس ایپ پر کام کرتا ہے۔`)

await sendMessage(from,`🚀 سیٹ اپ شروع کریں

PERSONAL  
BUSINESS`)

return res.sendStatus(200)

}



/* PURPOSE */

if(userState[from] === "purpose"){

userData[from] = { type: userText }

userState[from] = "name"

await sendMessage(from,"👤 What is your name?")

return res.sendStatus(200)

}



/* NAME */

if(userState[from] === "name"){

userData[from].name = text
userState[from] = "occupation"

await sendMessage(from,"💼 What is your occupation?")

return res.sendStatus(200)

}



/* OCCUPATION */

if(userState[from] === "occupation"){

userData[from].occupation = text
userState[from] = "email"

await sendMessage(from,"📧 Please share your email address.")

return res.sendStatus(200)

}



/* EMAIL */

if(userState[from] === "email"){

userData[from].email = text

const startDate = new Date()
const endDate = new Date()

endDate.setDate(startDate.getDate() + 7)

userState[from] = "active"

await sendMessage(from,`🎉 *Congratulations ${userData[from].name}!*

Your Hisabi Cash account is ready.

🆓 *7 Day Free Trial Started*

Start: ${startDate.toDateString()}
End: ${endDate.toDateString()}

Type *MENU* to open dashboard.`)

return res.sendStatus(200)

}



/* DASHBOARD */

if(userText === "menu"){

await sendMessage(from,`📊 *Hisabi Cash Dashboard*

Welcome *${userData[from]?.name || ""}* 👋

━━━━━━━━━━━━━━━

💰 Finance

SALE  
EXPENSE  
UDHAR  

━━━━━━━━━━━━━━━

📈 Reports

REPORT  
INSIGHT  

━━━━━━━━━━━━━━━

⚙️ Account

PLANS  
LANGUAGE  

━━━━━━━━━━━━━━━

Type any command above.`)

return res.sendStatus(200)

}



/* PLANS */

if(userText === "plans"){

await sendMessage(from,`💼 *Hisabi Cash Plans*

👤 Personal Plan  
Rs 399 / month  
Type: PERSONAL PLAN

🏪 Business Plan  
Rs 999 / month  
Type: BUSINESS PLAN`)

return res.sendStatus(200)

}



/* PERSONAL PLAN */

if(userText === "personal plan"){

await sendMessage(from,`✅ *Personal Plan Selected*

Price: Rs 399 / month`)

await sendMessage(from,`💳 *Complete Your Subscription*

Send payment to:

JazzCash / Easypaisa  
0316-3154140

Send screenshot after payment.

Verification time: 12-24 hours.`)

return res.sendStatus(200)

}



/* BUSINESS PLAN */

if(userText === "business plan"){

await sendMessage(from,`🏪 *Business Plan Selected*

Price: Rs 999 / month`)

await sendMessage(from,`💳 *Complete Your Subscription*

Send payment to:

JazzCash / Easypaisa  
0316-3154140

Send screenshot after payment.

Verification time: 12-24 hours.`)

return res.sendStatus(200)

}



return res.sendStatus(200)

}catch(error){

console.error(error)
res.sendStatus(500)

}

})

/* SERVER */

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
console.log("Server running on port", PORT)
})