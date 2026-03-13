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
updateTrial
} from "./userService.js"



function getMessages(language){

if(language === "roman") return roman
if(language === "urdu") return urdu

return english

}



export async function handleConversation(phone,message){

message = message.trim()

let user = await getUser(phone)



/* =========================
NEW USER
========================= */

if(!user){

await createUser(phone)

return english.welcome

}



/* =========================
LANGUAGE SELECTION
========================= */

if(user.state === "new_user"){

if(message === "1"){

await updateUserLanguage(phone,"english")
await updateUserState(phone,"introduction")

return english.languageSelected

}

if(message === "2"){

await updateUserLanguage(phone,"roman")
await updateUserState(phone,"introduction")

return roman.languageSelected

}

if(message === "3"){

await updateUserLanguage(phone,"urdu")
await updateUserState(phone,"introduction")

return urdu.languageSelected

}

return english.welcome

}



/* =========================
INTRODUCTION
========================= */

if(user.state === "introduction"){

const messages = getMessages(user.language)

await updateUserState(phone,"ask_name")

return messages.introduction

}



/* =========================
ASK NAME
========================= */

if(user.state === "ask_name"){

await updateUserName(phone,message)

await updateUserState(phone,"choose_usage")

const messages = getMessages(user.language)

return messages.usageSelection.replace("{user}",message)

}



/* =========================
USAGE TYPE
========================= */

if(user.state === "choose_usage"){

const text = message.toLowerCase()

const messages = getMessages(user.language)



if(text === "personal use"){

await updateUserUsage(phone,"personal")

await updateUserState(phone,"personal_profile")

return messages.personalProfile.replace("{user}",user.name || "User")

}



if(text === "business use"){

await updateUserUsage(phone,"business")

await updateUserState(phone,"business_profile")

return messages.businessProfile.replace("{user}",user.name || "User")

}



return messages.usageSelection.replace("{user}",user.name || "User")

}



/* =========================
PERSONAL PROFILE
========================= */

if(user.state === "personal_profile"){

await updateTrial(phone)

await updateUserState(phone,"active")

const messages = getMessages(user.language)

return messages.accountReady.replace("{user}",user.name)

}



/* =========================
BUSINESS PROFILE
========================= */

if(user.state === "business_profile"){

await updateUserBusiness(phone,message)

await updateTrial(phone)

await updateUserState(phone,"active")

const messages = getMessages(user.language)

return messages.accountReady.replace("{user}",user.name)

}



/* =========================
ACTIVE USER
========================= */

if(user.state === "active"){

const messages = getMessages(user.language)

const text = message.toLowerCase()



/* MENU */

if(text === "menu"){

return messages.dashboard
.replace("{user}",user.name || "User")
.replace("{business}",user.business_name || "-")
.replace("{trial}","14 days")

}



/* PLANS */

if(text === "plans"){

return messages.plans

}



/* LANGUAGE */

if(text === "language"){

await updateUserState(phone,"new_user")

return english.welcome

}



/* PERSONAL PLAN */

if(text === "personal plan"){

return messages.subscriptionActivatedPersonal

}



/* BUSINESS PLAN */

if(text === "business plan"){

return messages.subscriptionActivatedBusiness

}



/* =========================
SALE COMMAND
========================= */

if(text.startsWith("sale")){

const parts = message.split(" ")

const amount = parts[1]
const item = parts.slice(2).join(" ")

return messages.saleRecorded
.replace("{amount}",amount)
.replace("{item}",item)

}



/* =========================
EXPENSE COMMAND
========================= */

if(text.startsWith("expense")){

const parts = message.split(" ")

const amount = parts[1]
const item = parts.slice(2).join(" ")

return messages.expenseRecorded
.replace("{amount}",amount)
.replace("{item}",item)

}



/* =========================
UDHAR COMMAND
========================= */

if(text.startsWith("udhar")){

const parts = message.split(" ")

const amount = parts[1]
const customer = parts.slice(2).join(" ")

return messages.udharRecorded
.replace("{customer}",customer)
.replace("{amount}",amount)
.replace("{date}",new Date().toLocaleDateString())

}



/* REPORT */

if(text === "report"){

if(user.usage_type === "personal"){

return "📊 Personal report feature coming soon."

}

return "📊 Business report feature coming soon."

}



/* DEFAULT */

return messages.dashboard
.replace("{user}",user.name || "User")
.replace("{business}",user.business_name || "-")
.replace("{trial}","14 days")

}

}