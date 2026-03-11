import { getUserByPhone, createUser, updateUser } from "./userService.js"
import english from "../messages/english.js"
import roman from "../messages/roman.js"
import urdu from "../messages/urdu.js"

export async function handleConversation(phone, text) {

const lower = text.toLowerCase()

let user = await getUserByPhone(phone)

/* NEW USER */

if(!user){

await createUser({
phone: phone,
state: "language_select"
})

return english.welcome
}

/* LANGUAGE SELECTION */

if(user.state === "language_select"){

if(text === "1"){

await updateUser(phone,{
language: "english",
state: "intro"
})

return english.languageConfirmation + "\n\n" + english.introduction
}

if(text === "2"){

await updateUser(phone,{
language: "roman",
state: "intro"
})

return roman.languageConfirmation + "\n\n" + roman.introduction
}

if(text === "3"){

await updateUser(phone,{
language: "urdu",
state: "intro"
})

return urdu.languageConfirmation + "\n\n" + urdu.introduction
}

return english.welcome
}

/* INTRO → ASK NAME */

if(user.state === "intro"){

await updateUser(phone,{ state: "ask_name" })

if(user.language === "roman") return roman.askName
if(user.language === "urdu") return urdu.askName

return english.askName
}

/* SAVE NAME */

if(user.state === "ask_name"){

await updateUser(phone,{
name: text,
state: "ask_usage"
})

if(user.language === "roman") return roman.usageSelection
if(user.language === "urdu") return urdu.usageSelection

return english.usageSelection
}

/* USAGE TYPE */

if(user.state === "ask_usage"){

if(lower.includes("personal")){

await updateUser(phone,{
usage_type:"personal",
state:"ask_occupation"
})

if(user.language === "roman") return roman.personalOccupation
if(user.language === "urdu") return urdu.personalOccupation

return english.personalOccupation
}

if(lower.includes("business")){

await updateUser(phone,{
usage_type:"business",
state:"ask_business"
})

if(user.language === "roman") return roman.businessSetup
if(user.language === "urdu") return urdu.businessSetup

return english.businessSetup
}

}

/* BUSINESS NAME */

if(user.state === "ask_business"){

await updateUser(phone,{
business_name:text,
state:"trial_active"
})

return english.accountReady
}

/* OCCUPATION */

if(user.state === "ask_occupation"){

await updateUser(phone,{
occupation:text,
state:"trial_active"
})

return english.accountReady
}

/* ACTIVE USER */

if(user.state === "trial_active"){

if(lower === "menu"){
return english.dashboard(user.name)
}

}

return "Type MENU to open dashboard."
}