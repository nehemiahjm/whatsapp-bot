
import english from "../messages/english.js"
import roman from "../messages/roman.js"
import urdu from "../messages/urdu.js"

import {
getUser,
createUser,
updateUserLanguage,
updateUserState
} from "./userService.js"


function getMessages(language){

if(language === "roman") return roman
if(language === "urdu") return urdu

return english

}



export async function handleConversation(phone,message){

message = message.trim()

let user = await getUser(phone)



// NEW USER
if(!user){

await createUser(phone)

return english.welcome

}



// LANGUAGE SELECTION
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



// ASK USER NAME
if(user.state === "introduction"){

const messages = getMessages(user.language)

await updateUserState(phone,"ask_name")

return messages.askName

}



// SAVE USER NAME
if(user.state === "ask_name"){

await updateUserState(phone,"choose_usage")

const messages = getMessages(user.language)

return messages.usageSelection.replace("Ali",message)

}



// USAGE TYPE SELECTION
if(user.state === "choose_usage"){

const messages = getMessages(user.language)

const text = message.toLowerCase()

if(text === "personal use"){

await updateUserState(phone,"personal_profile")

return messages.personalProfile.replace("Ali","User")

}

if(text === "business use"){

await updateUserState(phone,"business_profile")

return messages.businessProfile.replace("Ali","User")

}

return messages.usageSelection

}



// PERSONAL PROFILE
if(user.state === "personal_profile"){

await updateUserState(phone,"active")

const messages = getMessages(user.language)

return messages.accountReady.replace("Ali","User") + "\n\n" + messages.dashboard

}



// BUSINESS PROFILE
if(user.state === "business_profile"){

await updateUserState(phone,"active")

const messages = getMessages(user.language)

return messages.accountReady.replace("Ali","User") + "\n\n" + messages.dashboard

}



// ACTIVE USER
if(user.state === "active"){

const messages = getMessages(user.language)

const text = message.toLowerCase()

if(text === "menu"){
    return messages.dashboard
}

if(text === "plans"){
    return messages.plans
}

if(text === "report"){
    return messages.financialSummary
}

if(text === "language"){
    await updateUserState(phone,"new_user")
    return messages.welcome
}

return messages.dashboard

}

}