module.exports={

english:{
greeting:`👋 Welcome to Hisabi Cash

Please select your language

1 English
2 Roman Urdu
3 اردو`,
languageMenu:`🌐 Language Settings

1 English
2 Roman Urdu
3 اردو`,
languageConfirm:`✅ Language updated.`,
intro:`💼 Hisabi Cash helps you manage your finances easily.`,
purpose:`How will you use Hisabi Cash?

PERSONAL
BUSINESS`,
invalidPurpose:`Please reply with PERSONAL or BUSINESS.`,
askName:`👤 What is your name?`,
askOccupation:`💼 What is your occupation?`,
askEmail:`📧 Please send your email.`,
trialSuccess:(name,start,end)=>`🎉 Welcome ${name}

Your 7-day free trial started

Start: ${start.toDateString()}
End: ${end.toDateString()}

Type MENU`,
expired:`⚠ Your trial has expired.

Type PLANS`,
dashboard:(name)=>`📊 Dashboard

${name}

SALE
EXPENSE
UDHAR

REPORT
INSIGHT

PLANS
LANGUAGE`,
saleGuide:`💰 Record Sale

SALE amount item

Example:
SALE 500 chai`,
expenseGuide:`📉 Record Expense

EXPENSE amount item

Example:
EXPENSE 200 milk`,
udharGuide:`📒 Record Udhar

UDHAR name amount

Example:
UDHAR Ali 1000`,
report:`📊 Reports

DAILY REPORT
WEEKLY REPORT
MONTHLY REPORT`,
insight:`📈 Insight

Keep expenses below 40% of sales.`,
plans:`💼 Plans

Personal Plan 399

Business Plan 999

Type PERSONAL PLAN
Type BUSINESS PLAN`,
payment:(plan,price)=>`💳 ${plan}

Price: ${price}

JazzCash / Easypaisa
03163154140

Send screenshot

Verification 12-24 hours`
},

roman:{
greeting:`👋 Hisabi Cash mein khush aamdeed

1 English
2 Roman Urdu
3 Urdu`,
languageMenu:`Zabaan change karein

1 English
2 Roman Urdu
3 Urdu`,
languageConfirm:`Zabaan update ho gayi.`,
intro:`Hisabi Cash aapko paison ka hisaab rakhne mein madad deta hai.`,
purpose:`Aap kis liye use karenge?

PERSONAL
BUSINESS`,
invalidPurpose:`Sirf PERSONAL ya BUSINESS likhein.`,
askName:`Aapka naam?`,
askOccupation:`Aap kya kaam karte hain?`,
askEmail:`Apna email bhejein.`,
trialSuccess:(name,start,end)=>`Mubarak ho ${name}

7 din ka trial shuru

Start ${start.toDateString()}
End ${end.toDateString()}

MENU likhein`,
expired:`Trial khatam ho gaya

PLANS likhein`,
dashboard:(name)=>`Dashboard

${name}

SALE
EXPENSE
UDHAR

REPORT
INSIGHT

PLANS
LANGUAGE`,
saleGuide:`Sale record karein

SALE amount item`,
expenseGuide:`Kharcha record karein

EXPENSE amount item`,
udharGuide:`Udhar record karein

UDHAR naam amount`,
report:`Reports

DAILY
WEEKLY
MONTHLY`,
insight:`Tip

Kharcha kam rakhein.`,
plans:`Plans

Personal 399

Business 999`,
payment:(plan,price)=>`${plan}

Price ${price}

JazzCash / Easypaisa
03163154140

Screenshot bhejein`
},

urdu:{
greeting:`👋 حسابی کیش میں خوش آمدید

1 English
2 Roman Urdu
3 اردو`,
languageMenu:`زبان تبدیل کریں

1 English
2 Roman Urdu
3 اردو`,
languageConfirm:`زبان تبدیل ہو گئی`,
intro:`حسابی کیش آپ کو مالی حساب رکھنے میں مدد دیتا ہے`,
purpose:`آپ کس مقصد کیلئے استعمال کریں گے؟

PERSONAL
BUSINESS`,
invalidPurpose:`PERSONAL یا BUSINESS لکھیں`,
askName:`آپ کا نام؟`,
askOccupation:`آپ کیا کام کرتے ہیں؟`,
askEmail:`اپنا ای میل بھیجیں`,
trialSuccess:(name,start,end)=>`مبارک ہو ${name}

7 دن کا ٹرائل شروع

Start ${start.toDateString()}
End ${end.toDateString()}

MENU لکھیں`,
expired:`ٹرائل ختم ہو گیا

PLANS لکھیں`,
dashboard:(name)=>`ڈیش بورڈ

${name}

SALE
EXPENSE
UDHAR

REPORT
INSIGHT

PLANS
LANGUAGE`,
saleGuide:`سیل درج کریں

SALE amount item`,
expenseGuide:`خرچ درج کریں

EXPENSE amount item`,
udharGuide:`ادھار درج کریں

UDHAR name amount`,
report:`رپورٹس

DAILY
WEEKLY
MONTHLY`,
insight:`مشورہ

اخراجات کم رکھیں`,
plans:`پلانز

Personal 399

Business 999`,
payment:(plan,price)=>`${plan}

قیمت ${price}

JazzCash / Easypaisa
03163154140

اسکرین شاٹ بھیجیں`
}

};