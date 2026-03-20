import axios from "axios"
import { handleConversation } from "./services/conversationService.js"

const TOKEN = process.env.WHATSAPP_TOKEN
const PHONE_ID = process.env.PHONE_NUMBER_ID


/* 🔥 SEND TEXT */
async function sendText(to, body){
    await axios.post(
        `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`,
        {
            messaging_product: "whatsapp",
            to: to,
            text: { body: String(body) }
        },
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            }
        }
    )
}


/* 🔥 SEND DOCUMENT (PDF) */
async function sendDocument(to, filePath){

    await axios.post(
        `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`,
        {
            messaging_product: "whatsapp",
            to: to,
            type: "document",
            document: {
                link: filePath, // ⚠️ MUST be public URL
                filename: "Hisabi_Report.pdf"
            }
        },
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            }
        }
    )
}


/* 🔥 SEND TEMPLATE */
async function sendTemplate(to, templateName, params, lang="en_US"){

    await axios.post(
        `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`,
        {
            messaging_product: "whatsapp",
            to: to,
            type: "template",
            template: {
                name: templateName,
                language: { code: lang },
                components: [
                    {
                        type: "body",
                        parameters: params.map(p => ({
                            type: "text",
                            text: String(p)
                        }))
                    }
                ]
            }
        },
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            }
        }
    )
}



/* 🔥 MAIN WEBHOOK */
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


        const text = msg.text?.body || ""

        console.log("Incoming:", text)


        if (!text) return res.sendStatus(200)

        const replies = await handleConversation(phone, text)

        if (!replies) return res.sendStatus(200)



        /* 🔥 CASE 1: OBJECT RESPONSE */
        if (typeof replies === "object" && !Array.isArray(replies)) {


            if (replies.type === "template") {

                await sendTemplate(
                    replies.to,
                    replies.templateName,
                    replies.params,
                    replies.language || "en_US"
                )


                if (replies.ownerMessage){
                    await sendText(phone, replies.ownerMessage)
                }

                return res.sendStatus(200)
            }
            

            if (replies.to && replies.message){
                await sendText(replies.to, replies.message)
                return res.sendStatus(200)
            }
        }


        /* 🔥 CASE 2: ARRAY / STRING */
        const messagesToSend = Array.isArray(replies) ? replies : [replies]

        for (const reply of messagesToSend) {

            if (!reply) continue

            // 🔥 PDF DETECTION
            if (typeof reply === "object" && reply.type === "pdf") {
                await sendDocument(phone, reply.path)
            } else {
                await sendText(phone, reply)
            }

            await new Promise(r => setTimeout(r, 400))
        }

        res.sendStatus(200)

    } catch (err) {

        console.error("Webhook Crash:", err.response?.data || err.message)
        res.sendStatus(200)
    }
}