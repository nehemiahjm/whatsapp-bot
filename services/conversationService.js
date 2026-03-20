import english from "../messages/english.js"
import roman from "../messages/roman.js"
import urdu from "../messages/urdu.js"

import {
getUser,
createUser,
updateUserLanguage,
updateUserState,
updateUserName,
updateUserUsage,
updateUserBusiness,
updateTrial,
saveTransaction,
getReport,
saveUdhar,
getUdharSummary,
markUdharPaid,
getPendingUdhar,
saveCustomerPhone
} from "./userService.js"

import { detectTransaction } from "../openai.js"



function getMessages(language){
    
if(language === "roman") return roman
if(language === "urdu") return urdu

return english
}


function getRemainingDays(user){
if(!user.trial_end) return 0

const now = new Date()
const end = new Date(user.trial_end)
const diff = Math.ceil((end - now)/(1000*60*60*24))
return diff > 0 ? diff : 0
}



export async function handleConversation(phone,message){

message = message?.trim()


if(!message) return null

let user = await getUser(phone)



/* NEW USER */

if(!user){

await createUser(phone)

return english.welcome

}



/* LANGUAGE SELECTION */

if(user.state === "new_user"){

if(message === "1"){

await updateUserLanguage(phone,"english")
await updateUserState(phone,"introduction")

return english.languageSelected + "\n\n" + english.introduction

}

if(message === "2"){

await updateUserLanguage(phone,"roman")
await updateUserState(phone,"introduction")

return roman.languageSelected + "\n\n" + roman.introduction

}

if(message === "3"){

await updateUserLanguage(phone,"urdu")
await updateUserState(phone,"introduction")

return urdu.languageSelected + "\n\n" + urdu.introduction

}

return english.welcome

}



/* CHANGE LANGUAGE */

if(user.state === "change_language"){

const u = await getUser(phone)
const remainingDays = getRemainingDays(u)

if(message === "1"){

await updateUserLanguage(phone,"english")
await updateUserState(phone,"active")

return [
english.languageSelected,
english.dashboard.replace("{user}",u.name || "User").replace("{business}",u.business_name || "—").replace("{trial}",`${remainingDays} days`)
]
}

if(message === "2"){

await updateUserLanguage(phone,"roman")
await updateUserState(phone,"active")

return [
roman.languageSelected,
roman.dashboard.replace("{user}",u.name || "User").replace("{business}",u.business_name || "—").replace("{trial}",`${remainingDays} days`)
]
}

if(message === "3"){

await updateUserLanguage(phone,"urdu")
await updateUserState(phone,"active")

return [
urdu.languageSelected,
urdu.dashboard.replace("{user}",u.name || "User").replace("{business}",u.business_name || "—").replace("{trial}",`${remainingDays} days`)
]
}

return getMessages(user.language).changeLanguagePrompt
}



/* INTRO */

if(user.state === "introduction"){

await updateUserState(phone,"ask_name")
return getMessages(user.language).askName
}



/* NAME */

if(user.state === "ask_name"){

await updateUserName(phone,message)

await updateUserState(phone,"choose_usage")

user = await getUser(phone)
return getMessages(user.language).usageSelection.replace("{user}",message)

}



/* PROFILE */

if(user.state === "personal_profile"){

await updateTrial(phone)

await updateUserState(phone,"active")
return getMessages(user.language).accountReady.replace("{user}",user.name || "User").replace("{business}","—")
}

if(user.state === "business_profile"){

await updateUserBusiness(phone,message)

await updateTrial(phone)

await updateUserState(phone,"active")
return getMessages(user.language).accountReady.replace("{user}",user.name || "User").replace("{business}",message)
}



/* TRIAL LOCK */
const remainingDays = getRemainingDays(user)
const m = getMessages(user.language)

if(user.state === "active" && remainingDays <= 0){
if(message.toLowerCase() !== "plans"){
return m.trialEnded
}
}



/* CUSTOMER NUMBER */
if(user.state === "awaiting_customer_number"){

const customerPhone = message
const customer = user.usage_type

await saveCustomerPhone(phone, customer, customerPhone)


const data = await getPendingUdhar(phone)
const row = data.find(x => x.customer_name === customer)

const amount = row?.total || 0

await updateUserState(phone,"active")



return [
m.sendingUdharReceipt,
m.customerReceipt
.replace("{customer}",customer)
.replace("{business}",user.business_name || "Your Store")
.replace("{amount}",amount)
.replace("{date}",new Date().toLocaleDateString())
]

}



/* =========================
ACTIVE (AI ENABLED)
========================= */

if(user.state === "active"){


const text = message.toLowerCase()

// 🔥 AI CORE
const ai = await detectTransaction(message)
console.log("AI RESULT:", ai)

/* AI SALE */
if(ai.type === "sale"){
await saveTransaction(phone,"sale",ai.amount,ai.description)
return m.saleRecorded.replace("{amount}",ai.amount).replace("{item}",ai.description)
}

/* AI EXPENSE */
if(ai.type === "expense"){
await saveTransaction(phone,"expense",ai.amount,ai.description)
return m.expenseRecorded.replace("{amount}",ai.amount).replace("{item}",ai.description)
}

/* AI UDHAR */
if(ai.type === "udhar"){
await saveUdhar(phone, ai.description, ai.amount)
await updateUserUsage(phone, ai.description)
await updateUserState(phone,"awaiting_customer_number")

return [
m.udharRecorded.replace("{customer}",ai.description).replace("{amount}",ai.amount),
m.askCustomerNumber
]
}

/* AI UDHAR PAID */
if(ai.type === "udhar_paid"){
await markUdharPaid(phone, ai.description)
return `✅ Udhar cleared for ${ai.description}`
}



/* FALLBACK COMMANDS */

if(text === "hello" || text === "hi"){
return [
m.welcomeBack.replace("{user}",user.name || "User"),
m.dashboard.replace("{user}",user.name || "User").replace("{business}",user.business_name || "—").replace("{trial}",`${remainingDays} days`)
]
}

if(text === "report"){

const d = await getReport(phone)

const sales = parseInt(d.total_sales) || 0
const expense = parseInt(d.total_expense) || 0
const udhar = parseInt(d.total_udhar) || 0
const profit = sales - expense

if(user.language === "urdu"){
return `📊 مالیاتی رپورٹ

💰 کل سیلز: ${sales}
📉 اخراجات: ${expense}
📒 ادھار: ${udhar}

📈 منافع: ${profit}`
}

return `📊 REPORT

Sales: ${sales}
Expense: ${expense}
Udhar: ${udhar}
Profit: ${profit}`
}


return m.dashboard.replace("{user}",user.name || "User").replace("{business}",user.business_name || "—").replace("{trial}",`${remainingDays} days`)
}

}