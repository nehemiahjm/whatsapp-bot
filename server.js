import express from "express"
import bodyParser from "body-parser"

import { sendMessage } from "./whatsapp.js"
import { handleConversation } from "./services/conversationService.js"

dotenv.config()

const app = express()
app.use(express.json())

app.use(bodyParser.json())

const PORT = process.env.PORT || 8080


app.get("/", (req, res) => {
res.send("Hisabi Cash Bot Running")
})



/* WHATSAPP WEBHOOK */

app.post("/webhook", async (req, res) => {

try{

const entry = req.body.entry?.[0]
const changes = entry?.changes?.[0]
const message = changes?.value?.messages?.[0]

if(!message){
return res.sendStatus(200)
}

const phone = message.from
const text = message.text?.body

console.log("Incoming message:", text)


const reply = await handleConversation(phone, text)


if(reply){
await sendMessage(phone, reply)
}


res.sendStatus(200)

}catch(err){

console.log("Webhook Error:",err)

res.sendStatus(200)

}

})


/* -------------------------------- */
/* START SERVER                     */
/* -------------------------------- */

app.listen(PORT, () => {
console.log(`🚀 Hisabi Cash server running on port ${PORT}`)
})