import express from "express"
import axios from "axios"
import dotenv from "dotenv"

import { handleConversation } from "./services/conversationService.js"

dotenv.config()

const app = express()
app.use(express.json())

const VERIFY_TOKEN = process.env.VERIFY_TOKEN
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID

const PORT = process.env.PORT || 8080


/* -------------------------------- */
/* SEND MESSAGE TO WHATSAPP         */
/* -------------------------------- */

async function sendMessage(to, message) {

  if (!message) {
    console.log("⚠ Empty message prevented")
    return
  }

  try {

    await axios.post(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    )

  } catch (error) {

    console.log("❌ Send message error:")
    console.log(error.response?.data || error.message)

  }
}


/* -------------------------------- */
/* WEBHOOK VERIFICATION             */
/* -------------------------------- */

app.get("/webhook", (req, res) => {

  const mode = req.query["hub.mode"]
  const token = req.query["hub.verify_token"]
  const challenge = req.query["hub.challenge"]

  if (mode === "subscribe" && token === VERIFY_TOKEN) {

    console.log("✅ Webhook verified")
    return res.status(200).send(challenge)

  }

  res.sendStatus(403)
})


/* -------------------------------- */
/* RECEIVE WHATSAPP MESSAGE         */
/* -------------------------------- */

app.post("/webhook", async (req, res) => {

  try {

    const entry = req.body.entry?.[0]
    const change = entry?.changes?.[0]
    const value = change?.value
    const message = value?.messages?.[0]

    if (!message) {
      return res.sendStatus(200)
    }

    const from = message.from
    const text = message.text?.body || ""

    console.log("📩 Incoming message:", text)


    /* PASS MESSAGE TO CONVERSATION ENGINE */

    const response = await handleConversation(from, text)


    if (response) {

      await sendMessage(from, response)

    }

    res.sendStatus(200)

  } catch (error) {

    console.log("❌ Webhook error:", error)

    console.log("ERROR:", err)
    res.sendStatus(200)

  }

})


/* -------------------------------- */
/* START SERVER                     */
/* -------------------------------- */

app.listen(PORT, () => {

  console.log(`🚀 Hisabi Cash server running on port ${PORT}`)

})