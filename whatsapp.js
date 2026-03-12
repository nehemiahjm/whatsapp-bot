import axios from "axios"
import { handleConversation } from "./services/conversationService.js"

const TOKEN = process.env.WHATSAPP_TOKEN
const PHONE_ID = process.env.PHONE_NUMBER_ID


export async function handleWebhook(req, res) {

    const body = req.body

    if (body.object) {

        const entry = body.entry?.[0]
        const change = entry?.changes?.[0]
        const value = change?.value
        const messages = value?.messages

        if (messages) {

            const message = messages[0]
            const phone = message.from
            const text = message.text?.body

            console.log("Incoming:", text)

            const reply = await handleConversation(phone, text)

            if (reply) {

                await axios.post(
                    `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`,
                    {
                        messaging_product: "whatsapp",
                        to: phone,
                        text: { body: reply }
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${TOKEN}`,
                            "Content-Type": "application/json"
                        }
                    }
                )
            }
        }

        res.sendStatus(200)

    } else {

        res.sendStatus(404)

    }
}