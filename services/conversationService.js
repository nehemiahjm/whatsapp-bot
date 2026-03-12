import { getUserByPhone, createUser } from "./userService.js"
import english from "../messages/english.js"
import roman from "../messages/roman.js"
import urdu from "../messages/urdu.js"

export async function handleConversation(phone, text) {

  let user = await getUserByPhone(phone)

  const greetings = ["hi","hello","salam","menu","start"]

  // FIRST MESSAGE
  if (!user) {
    
    await createUser(phone)
    return english.welcome
  }

  // GREETING ALWAYS SHOWS LANGUAGE MENU
  if (greetings.includes(text.toLowerCase())) {
    return english.welcome
  }

  // LANGUAGE SELECTION
  if (text === "1") {
    return romanToEnglishSelection()
  }

  if (text === "2") {
    return roman.welcome
  }

  if (text === "3") {
    return urdu.welcome
  }

  return "Please choose a valid option."
}

function romanToEnglishSelection(){
  return `✅ Language set to *English*

Next step coming soon...`
}