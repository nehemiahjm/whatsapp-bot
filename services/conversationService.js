import { getUserByPhone, createUser } from "./userService.js"
import english from "../messages/english.js"
import roman from "../messages/roman.js"
import urdu from "../messages/urdu.js"

export async function handleConversation(phone, text) {

  let user = await getUserByPhone(phone)

  // New user
  if (!user) {
    
    await createUser(phone)

    return `👋 Welcome to *Hisabi Cash*

Please select your language:

1️⃣ English
2️⃣ Roman Urdu
3️⃣ Urdu`
  }

  // Language selection
  if (text === "1") {
    return english.welcome
  }

  if (text === "2") {
    return roman.welcome
  }

  if (text === "3") {
    return urdu.welcome
  }

  return "Please choose a valid option."
}