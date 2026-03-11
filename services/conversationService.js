import { getUserByPhone, createUser, updateUser } from "./userService.js"

import english from "../messages/english.js"
import roman from "../messages/roman.js"
import urdu from "../messages/urdu.js"


export async function handleConversation(phone, text) {

const lower = text.toLowerCase()

let user = await getUserByPhone(phone)


// NEW USER
if (!user) {

await createUser({
phone: phone,
state: "language_select"
})

return english.welcome

}


// LANGUAGE FILE SELECTOR

let msg = english

if (user.language === "roman") msg = roman
if (user.language === "urdu") msg = urdu



// LANGUAGE SELECTION

if (user.state === "language_select") {

if (text === "1") {

await updateUser(phone, {
language: "english",
state: "intro"
})

return english.languageConfirmation + "\n\n" + english.introduction

}

if (text === "2") {

await updateUser(phone, {
language: "roman",
state: "intro"
})

return roman.languageConfirmation + "\n\n" + roman.introduction

}

if (text === "3") {

await updateUser(phone, {
language: "urdu",
state: "intro"
})

return urdu.languageConfirmation + "\n\n" + urdu.introduction

}

return english.welcome

}



// INTRO → ASK PURPOSE

if (user.state === "intro") {

await updateUser(phone,{
state:"purpose_select"
})

return msg.purposeQuestion

}



// PURPOSE SELECTION

if (user.state === "purpose_select") {

if(lower.includes("personal")){

await updateUser(phone,{
usage_type:"personal",
state:"ask_name"
})

return msg.askName

}

if(lower.includes("business")){

await updateUser(phone,{
usage_type:"business",
state:"ask_name"
})

return msg.askName

}

return msg.purposeQuestion

}



// NAME

if (user.state === "ask_name") {

await updateUser(phone,{
name:text,
state:"ask_occupation"
})

return msg.askOccupation

}



// OCCUPATION

if (user.state === "ask_occupation") {

await updateUser(phone,{
occupation:text,
state:"ask_email"
})

return msg.askEmail

}



// EMAIL

if (user.state === "ask_email") {

const now = new Date()

const trialEnd = new Date()
trialEnd.setDate(now.getDate()+7)

await updateUser(phone,{
email:text,
trial_start: now,
trial_end: trialEnd,
state:"dashboard"
})

return msg.congratulations

}



// MENU COMMAND

if(lower === "menu"){

return msg.menu

}



// PLANS COMMAND

if(lower === "plans"){

return msg.plans

}



// LANGUAGE CHANGE

if(lower === "language"){

await updateUser(phone,{
state:"language_select"
})

return msg.languageMenu

}



return msg.default

}