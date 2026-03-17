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



/* NEW USER */

if(!user){

await createUser(phone)

return english.welcome

}



/* LANGUAGE SELECTION (FIRST TIME) */

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



/* CHANGE LANGUAGE (ELITE UX - 2 MESSAGES) */

if(user.state === "change_language"){

if(message === "1"){

await updateUserLanguage(phone,"english")
await updateUserState(phone,"active")

const userData = await getUser(phone)

return [
english.languageChanged,
english.dashboard
.replace("{user}",userData.name || "User")
.replace("{business}",userData.business_name || "—")
.replace("{trial}","14 days")
]
}

if(message === "2"){

await updateUserLanguage(phone,"roman")
await updateUserState(phone,"active")

const userData = await getUser(phone)

return [
roman.languageChanged,
roman.dashboard
.replace("{user}",userData.name || "User")
.replace("{business}",userData.business_name || "—")
.replace("{trial}","14 days")
]
}

if(message === "3"){

await updateUserLanguage(phone,"urdu")
await updateUserState(phone,"active")

const userData = await getUser(phone)

return [
urdu.languageChanged,
urdu.dashboard
.replace("{user}",userData.name || "User")
.replace("{business}",userData.business_name || "—")
.replace("{trial}","14 days")
]
}

/* fallback */
const messages = getMessages(user.language)
return messages.changeLanguagePrompt

}



/* INTRODUCTION */

if(user.state === "introduction"){

const messages = getMessages(user.language)

await updateUserState(phone,"ask_name")

return messages.askName

}



/* ASK NAME */

if(user.state === "ask_name"){

await updateUserName(phone,message)

await updateUserState(phone,"choose_usage")

user = await getUser(phone)

const messages = getMessages(user.language)

return messages.usageSelection.replace("{user}",message)

}



/* USAGE TYPE */

if(user.state === "choose_usage"){



const messages = getMessages(user.language)

const text = message.toLowerCase()

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



/* PERSONAL PROFILE */

if(user.state === "personal_profile"){

await updateTrial(phone)

await updateUserState(phone,"active")

const messages = getMessages(user.language)

return messages.accountReady
.replace("{user}",user.name || "User")
.replace("{business}","—")

}



/* BUSINESS PROFILE */

if(user.state === "business_profile"){

await updateUserBusiness(phone,message)

await updateTrial(phone)

await updateUserState(phone,"active")

const messages = getMessages(user.language)

return messages.accountReady
.replace("{user}",user.name || "User")
.replace("{business}",message)

}



/* ACTIVE USER */

if(user.state === "active"){

const messages = getMessages(user.language)

const text = message.toLowerCase()



/* WELCOME BACK */

if(text === "hello" || text === "hi" || text === "start"){

return messages.welcomeBack
.replace("{user}",user.name || "User")

}



/* LANGUAGE COMMAND (PREMIUM TRIGGER) */

if(
text === "language" ||
text === "lang" ||
text === "zabaan" ||
text === "zuban" ||
text === "urdu" ||
text === "english"
){

await updateUserState(phone,"change_language")

return messages.changeLanguagePrompt

}



/* QUICK ENTRIES */

if(text.startsWith("sale")){
return messages.saleRecorded
.replace("{amount}",text.split(" ")[1] || "0")
.replace("{item}",text.split(" ").slice(2).join(" ") || "Item")
}

if(text.startsWith("expense")){
return messages.expenseRecorded
.replace("{amount}",text.split(" ")[1] || "0")
.replace("{item}",text.split(" ").slice(2).join(" ") || "Item")
}

if(text.startsWith("udhar")){
return messages.udharRecorded
.replace("{amount}",text.split(" ")[1] || "0")
.replace("{customer}",text.split(" ").slice(2).join(" ") || "Customer")
}



/* DASHBOARD */

if(text === "menu"){

return messages.dashboard
.replace("{user}",user.name || "User")
.replace("{business}",user.business_name || "—")
.replace("{trial}","14 days")

}



/* PLANS */

if(text === "plans") return messages.plans



/* REPORT */

if(text === "report") return messages.businessSummary



/* DEFAULT */

return messages.dashboard
.replace("{user}",user.name || "User")
.replace("{business}",user.business_name || "—")
.replace("{trial}","14 days")

}

}