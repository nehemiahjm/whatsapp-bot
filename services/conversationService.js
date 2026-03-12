import { getUserByPhone, createUser } from "./userService.js"
import english from "../messages/english.js"


export async function handleConversation(phone, text) {

  let user = await getUserByPhone(phone)

  if (!user) {

    await createUser(phone)

    return english.welcome
  }

  return "You said: " + text
}