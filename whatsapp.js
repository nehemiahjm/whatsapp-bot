import axios from "axios"

const token = process.env.WHATSAPP_TOKEN
const phoneId = process.env.PHONE_NUMBER_ID

export async function sendMessage(to, text) {

  await axios.post(
    `https://graph.facebook.com/v19.0/${phoneId}/messages`,
    {
      messaging_product: "whatsapp",
      to: to,
      text: { body: text }
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  )
}