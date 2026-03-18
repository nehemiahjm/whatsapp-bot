import axios from "axios"
import { handleConversation } from "./services/conversationService.js"

const TOKEN = process.env.WHATSAPP_TOKEN
const PHONE_ID = process.env.PHONE_NUMBER_ID


export async function handleWebhook(req, res) {

    try {

        const body = req.body

        if (!body.object) return res.sendStatus(404)

        const entry = body.entry?.[0]
        const change = entry?.changes?.[0]
        const value = change?.value
        const messages = value?.messages

        if (!messages) return res.sendStatus(200)

        const msg = messages[0]
        const phone = msg.from

        // 🔥 FIX: safe text extraction
        const text = msg.text?.body || ""

        console.log("Incoming:", text)

        // ignore empty messages
        if (!text) return res.sendStatus(200)

        const replies = await handleConversation(phone, text)

        if (replies) {

            const messagesToSend = Array.isArray(replies) ? replies : [replies]

            for (const reply of messagesToSend) {

                if (!reply) continue // 🔥 prevent empty send

                await axios.post(
                    `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`,
                    {
                        messaging_product: "whatsapp",
                        to: phone,
                        text: { body: String(reply) } // 🔥 force string
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${TOKEN}`,
                            "Content-Type": "application/json"
                        }
                    }
                )

                // 🔥 small delay prevents 400 errors
                await new Promise(r => setTimeout(r, 300))
            }
        }

        res.sendStatus(200)

    } catch (err) {

        console.error("Webhook Crash:", err.response?.data || err.message)
        res.sendStatus(200) // prevent WhatsApp retries loop
    }
}