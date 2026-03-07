module.exports = {

/* =========================
   ENGLISH
========================= */

english: {

greeting:
`👋 *Welcome to Hisabi Cash*

━━━━━━━━━━━━━━━━━━

🌐 *Select Your Preferred Language*

1️⃣ English  
2️⃣ Roman Urdu  
3️⃣ اردو (Urdu)

Reply with *1, 2, or 3* to continue.`,

languageMenu:
`🌐 *Language Settings*

Choose the language you want Hisabi Cash to communicate in.

1️⃣ English  
2️⃣ Roman Urdu  
3️⃣ اردو (Urdu)`,

languageConfirm:
`✅ *Language Updated Successfully*

Hisabi Cash will now communicate in the selected language.`,

intro:
`💼 *About Hisabi Cash*

Hisabi Cash helps shopkeepers, freelancers, and small businesses keep their finances organized directly through WhatsApp.

You can easily:

• Track daily sales  
• Record business expenses  
• Manage udhar / khata  
• Monitor financial activity  
• Generate reports`,

purpose:
`🚀 *Getting Started*

Before we begin, please tell us how you plan to use Hisabi Cash.

Type one of the following:

PERSONAL  
BUSINESS`,

invalidPurpose:
`⚠ *Input Not Recognized*

Please type either:

PERSONAL  
BUSINESS`,

askName:`👤 Please tell us your name.`,

askOccupation:`💼 What type of work or business do you do?`,

askEmail:`📧 Please share your email address.`,

trialSuccess:(name,start,end)=>
`🎉 *Welcome ${name}!*

Your Hisabi Cash account has been successfully created.

🆓 *7 Day Free Trial Activated*

Start Date: ${start.toDateString()}  
End Date: ${end.toDateString()}

To open your dashboard type:

MENU`,

expired:
`⚠ *Subscription Required*

Your trial or subscription has expired.

Type:

PLANS

to view available plans.`,

dashboard:(name)=>
`📊 *Hisabi Cash Dashboard*

Welcome back *${name}* 👋

💰 Finance Tools
SALE — Record daily sales  
EXPENSE — Track business expenses  
UDHAR — Manage customer credit  

📈 Reports & Analysis
REPORT — Generate financial reports  
INSIGHT — View financial insights  

⚙ Account
PLANS — View subscription plans  
LANGUAGE — Change assistant language`,

saleGuide:
`💰 *Record a Sale*

SALE amount item

Example:
SALE 500 chai`,

expenseGuide:
`📉 *Record an Expense*

EXPENSE amount item

Example:
EXPENSE 200 milk`,

udharGuide:
`📒 *Customer Udhar*

UDHAR name amount

Example:
UDHAR Ali 1000`,

report:
`📊 *Financial Reports*

DAILY REPORT  
WEEKLY REPORT  
MONTHLY REPORT`,

insight:
`📈 *Financial Insight*

Hisabi Cash analyzes your financial activity to help improve your business.`,

plans:
`💼 *Hisabi Cash Subscription Plans*

👤 Personal Plan  
Rs 399 / month  

Type:
PERSONAL PLAN

🏪 Business Plan  
Rs 999 / month  

Type:
BUSINESS PLAN`,

payment:(plan,price)=>
`💳 *${plan} Subscription Selected*

Plan Price: ${price}

📲 Payment Methods

JazzCash  
Easypaisa  

Send payment to:

0316-3154140

📌 Payment Instructions

1️⃣ Send payment using JazzCash or Easypaisa  
2️⃣ Take a screenshot of the transaction  
3️⃣ Send the screenshot in this chat

🔐 Verification Process

Your payment will be verified by the Hisabi Cash team.

⏱ Verification Time: 12–24 hours

Once your payment is confirmed:

• Your subscription will be activated  
• Full access will be granted  
• You will receive a confirmation message.`

},

/* =========================
   ROMAN URDU
========================= */

roman: {

greeting:
`👋 *Hisabi Cash mein Khush Aamdeed*

🌐 Apni Zabaan Select Karein

1️⃣ English  
2️⃣ Roman Urdu  
3️⃣ Urdu`,

languageMenu:
`Zabaan change karein

1️⃣ English  
2️⃣ Roman Urdu  
3️⃣ Urdu`,

languageConfirm:`Zabaan successfully update ho gayi.`,

intro:`Hisabi Cash aapko apne business aur paison ka hisaab rakhne mein madad karta hai.`,

purpose:`Aap Hisabi Cash kis liye use karenge?

PERSONAL  
BUSINESS`,

invalidPurpose:`Sirf PERSONAL ya BUSINESS likhein.`,

askName:`Aapka naam kya hai?`,

askOccupation:`Aap kya kaam karte hain?`,

askEmail:`Apna email bhejein.`,

trialSuccess:(name,start,end)=>
`Mubarak ho ${name}

Aapka 7 din ka free trial shuru ho gaya hai.

Start: ${start.toDateString()}
End: ${end.toDateString()}

Dashboard kholne ke liye likhein:

MENU`,

expired:`Aapka trial ya subscription khatam ho gaya hai.

Continue karne ke liye plan lena zaroori hai.

PLANS likhein.`,

dashboard:(name)=>
`Dashboard

${name}

SALE — sale record karein  
EXPENSE — kharcha record karein  
UDHAR — udhar manage karein  

REPORT — financial report dekhein  
INSIGHT — business insights dekhein  

PLANS — subscription plans  
LANGUAGE — zabaan change karein`,

saleGuide:`SALE amount item likhein  
Example: SALE 500 chai`,

expenseGuide:`EXPENSE amount item likhein`,

udharGuide:`UDHAR naam amount likhein`,

report:`DAILY REPORT  
WEEKLY REPORT  
MONTHLY REPORT`,

insight:`Hisabi Cash aapko financial insights deta hai.`,

plans:`Personal Plan 399/month

Business Plan 999/month`,

payment:(plan,price)=>
`💳 *${plan} Subscription Select Ho Gaya Hai*

Plan Price: ${price}

📲 Payment Methods

JazzCash  
Easypaisa  

Payment bhejein is number par:

0316-3154140

📌 Payment Karne Ka Tarika

1️⃣ JazzCash ya Easypaisa se payment bhejein  
2️⃣ Transaction ka screenshot lein  
3️⃣ Screenshot isi chat mein bhejein

🔐 Verification Process

Aapki payment Hisabi Cash team verify karegi.

⏱ Verification Time: 12–24 hours

Jaise hi payment verify ho jaye:

• Aapki subscription activate kar di jayegi  
• Aapko full access mil jayega  
• Aapko confirmation message mil jayega.`

},

/* =========================
   URDU
========================= */

urdu: {

greeting:`👋 حسابی کیش میں خوش آمدید

1️⃣ English  
2️⃣ Roman Urdu  
3️⃣ اردو`,

languageMenu:`زبان تبدیل کریں`,

languageConfirm:`زبان تبدیل ہو گئی۔`,

intro:`حسابی کیش آپ کے کاروبار کا حساب رکھنے میں مدد دیتا ہے۔`,

purpose:`آپ کس مقصد کے لئے استعمال کریں گے؟

PERSONAL
BUSINESS`,

invalidPurpose:`PERSONAL یا BUSINESS لکھیں۔`,

askName:`آپ کا نام کیا ہے؟`,

askOccupation:`آپ کیا کام کرتے ہیں؟`,

askEmail:`اپنا ای میل بھیجیں۔`,

trialSuccess:(name,start,end)=>`مبارک ہو ${name}

آپ کا 7 دن کا فری ٹرائل شروع ہو گیا ہے۔`,

expired:`آپ کی سبسکرپشن ختم ہو گئی ہے۔

PLANS لکھیں۔`,

dashboard:(name)=>`ڈیش بورڈ ${name}`,

saleGuide:`SALE amount item لکھیں`,

expenseGuide:`EXPENSE amount item لکھیں`,

udharGuide:`UDHAR name amount لکھیں`,

report:`DAILY REPORT  
WEEKLY REPORT  
MONTHLY REPORT`,

insight:`مالی مشورے`,

plans:`Personal Plan 399  
Business Plan 999`,

payment:(plan,price)=>
`💳 *${plan} سبسکرپشن منتخب ہو گئی ہے*

پلان کی قیمت: ${price}

📲 ادائیگی کے طریقے

JazzCash  
Easypaisa  

ادائیگی اس نمبر پر بھیجیں:

0316-3154140

📌 ادائیگی کرنے کا طریقہ

1️⃣ JazzCash یا Easypaisa کے ذریعے ادائیگی کریں  
2️⃣ ٹرانزیکشن کا اسکرین شاٹ لیں  
3️⃣ اسکرین شاٹ اسی چیٹ میں بھیج دیں

🔐 تصدیقی عمل

آپ کی ادائیگی Hisabi Cash ٹیم کی طرف سے ویریفائی کی جائے گی۔

⏱ تصدیق کا وقت: 12 سے 24 گھنٹے

ادائیگی کی تصدیق ہونے کے بعد:

• آپ کی سبسکرپشن فعال کر دی جائے گی  
• آپ کو تمام فیچرز تک مکمل رسائی مل جائے گی  
• آپ کو تصدیقی پیغام موصول ہوگا۔`

}

};