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



function getMessages(language){

if(language === "roman") return roman
if(language === "urdu") return urdu

return english

}



export async function handleConversation(phone,message){

message = message.trim()

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

if(message === "1"){

await updateUserLanguage(phone,"english")
await updateUserState(phone,"active")

return [
english.languageChanged,
english.dashboard.replace("{user}",u.name || "User").replace("{business}",u.business_name || "—").replace("{trial}","14 days")
]
}

if(message === "2"){

await updateUserLanguage(phone,"roman")
await updateUserState(phone,"active")

return [
roman.languageChanged,
roman.dashboard.replace("{user}",u.name || "User").replace("{business}",u.business_name || "—").replace("{trial}","14 days")
]
}

if(message === "3"){

await updateUserLanguage(phone,"urdu")
await updateUserState(phone,"active")

return [
urdu.languageChanged,
urdu.dashboard.replace("{user}",u.name || "User").replace("{business}",u.business_name || "—").replace("{trial}","14 days")
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



/* USAGE */

if(user.state === "choose_usage"){
const m = getMessages(user.language)
const text = message.toLowerCase()

if(text === "personal use"){

await updateUserUsage(phone,"personal")

await updateUserState(phone,"personal_profile")
return m.personalProfile.replace("{user}",user.name || "User")
}

if(text === "business use"){

await updateUserUsage(phone,"business")

await updateUserState(phone,"business_profile")
return m.businessProfile.replace("{user}",user.name || "User")
}

return m.usageSelection.replace("{user}",user.name || "User")
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



/* 🔥 CUSTOMER NUMBER STATE */

if(user.state === "awaiting_customer_number"){

const customerPhone = message
const customer = user.usage_type // stored earlier

await saveCustomerPhone(phone, customer, customerPhone)

await updateUserState(phone,"active")

const m = getMessages(user.language)

return [
m.sendingUdharReceipt,
m.customerReceipt
.replace("{customer}",customer)
.replace("{business}",user.business_name || "Your Store")
.replace("{amount}","—")
.replace("{date}",new Date().toLocaleDateString())
]

}



/* ACTIVE */

if(user.state === "active"){

const m = getMessages(user.language)
const text = message.toLowerCase()



/* WELCOME */

if(text === "hello" || text === "hi" || text === "start"){

return [
m.welcomeBack.replace("{user}",user.name || "User"),
m.dashboard.replace("{user}",user.name || "User").replace("{business}",user.business_name || "—").replace("{trial}","14 days")
]

}



/* LANGUAGE */

if(text === "language" || text === "lang" || text === "zabaan" || text === "zuban"){
await updateUserState(phone,"change_language")
return m.changeLanguagePrompt
}



/* UDHAR PAID */

if(text.startsWith("udhar paid")){

const customer = text.replace("udhar paid","").trim()

if(!customer){
return "⚠️ Please specify customer name.\n\nExample:\nUdhar Paid Ahmed"
}

await markUdharPaid(phone, customer)

return `✅ *UDHAR CLEARED*

───────────────

👤 Customer: ${customer}

All pending udhar marked as PAID.

───────────────

✨ Type MENU to return dashboard`
}



/* UDHAR LIST */

if(text === "udhar list"){

const data = await getUdharSummary(phone)

if(!data.length){
return `📒 *UDHAR SUMMARY*\n\nNo pending udhar found.`
}

let r = `📒 *UDHAR SUMMARY*\n\n`
data.forEach(x=>{
r += `👤 ${x.customer_name}\n💰 Rs ${x.total}\n\n`
})




return r
}

/* 🔥 ADD UDHAR + VALIDATION */
if(text.startsWith("udhar")){

const parts = text.split(" ")

if(parts.length < 3){
return "⚠️ Format incorrect.\n\nExample:\nUdhar 1000 Ahmed"
}

const amount = parseInt(parts[1]) || 0
const customer = parts.slice(2).join(" ")

await saveUdhar(phone, customer, amount)

/* STORE TEMP CUSTOMER */
await updateUserUsage(phone, customer)

/* ASK NUMBER */
await updateUserState(phone,"awaiting_customer_number")

return m.askCustomerNumber
}



/* SALE */

if(text.startsWith("sale")){
const p = text.split(" ")
const amount = parseInt(p[1]) || 0
const item = p.slice(2).join(" ") || "Item"
await saveTransaction(phone,"sale",amount,item)
return m.saleRecorded.replace("{amount}",amount).replace("{item}",item)
}



/* EXPENSE */

if(text.startsWith("expense")){
const p = text.split(" ")
const amount = parseInt(p[1]) || 0
const item = p.slice(2).join(" ") || "Item"
await saveTransaction(phone,"expense",amount,item)
return m.expenseRecorded.replace("{amount}",amount).replace("{item}",item)









}



/* REPORT */

if(text === "report"){

const d = await getReport(phone)

const sales = parseInt(d.total_sales) || 0
const expense = parseInt(d.total_expense) || 0
const udhar = parseInt(d.total_udhar) || 0
const profit = sales - expense

return `📊 *FINANCIAL REPORT*

💰 Sales: Rs ${sales}
📉 Expense: Rs ${expense}
📒 Udhar: Rs ${udhar}

📈 Profit: Rs ${profit}`
}

/* MENU */
if(text === "menu"){
return m.dashboard.replace("{user}",user.name || "User").replace("{business}",user.business_name || "—").replace("{trial}","14 days")
}

/* DEFAULT */

return m.dashboard.replace("{user}",user.name || "User").replace("{business}",user.business_name || "—").replace("{trial}","14 days")

}

}