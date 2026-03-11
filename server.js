require("dotenv").config()

const express = require("express")
const { sendMessage } = require("./whatsapp")

const {
findUser,
createUser,
updateLanguage,
updateState,
updateName,
updateUserType,
updateOccupation,
updateBusinessName
} = require("./services/userService")

const english = require("./messages/english")
const roman = require("./messages/roman")
const urdu = require("./messages/urdu")

const app = express()
app.use(express.json())

const VERIFY_TOKEN = process.env.VERIFY_TOKEN

/* Helper */

function getMessages(language){
if(language === "roman") return roman
if(language === "urdu") return urdu
return english
}

/* ROOT */

app.get("/",(req,res)=>{
res.send("Hisabi Cash Bot Running")
})

/* WEBHOOK VERIFY */

app.get("/webhook",(req,res)=>{

const mode = req.query["hub.mode"]
const token = req.query["hub.verify_token"]
const challenge = req.query["hub.challenge"]

if(mode && token === VERIFY_TOKEN){
console.log("Webhook verified")
return res.status(200).send(challenge)
}

return res.sendStatus(403)

})

/* MAIN BOT */

app.post("/webhook", async (req,res)=>{

try{

const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]

if(!message) return res.sendStatus(200)

const from = message.from
const text = message.text?.body?.trim()

if(!text) return res.sendStatus(200)

/* LOAD USER */

let user = await findUser(from)

/* FIRST TIME USER */

if(!user){

await createUser(from)

await sendMessage(from, english.welcome)

return res.sendStatus(200)

}

/* LANGUAGE */

let lang = user.language || "english"
let msg = getMessages(lang)

const input = text.toLowerCase()

/* LANGUAGE COMMAND */

if(input === "language"){

await updateState(from,"language")

await sendMessage(from, msg.welcome)

return res.sendStatus(200)

}

/* LANGUAGE SELECTION */

if(user.state === "language"){

if(text === "1"){

await updateLanguage(from,"english")
await updateState(from,"intro")

await sendMessage(from, english.languageSelected)

await sendMessage(from, english.intro)

return res.sendStatus(200)

}

if(text === "2"){

await updateLanguage(from,"roman")
await updateState(from,"intro")

await sendMessage(from, roman.languageSelected)

await sendMessage(from, roman.intro)

return res.sendStatus(200)

}

if(text === "3"){

await updateLanguage(from,"urdu")
await updateState(from,"intro")

await sendMessage(from, urdu.languageSelected)

await sendMessage(from, urdu.intro)

return res.sendStatus(200)

}

}

/* ASK NAME */

if(user.state === "intro"){

await updateName(from,text)

await updateState(from,"usage")

await sendMessage(from,msg.askUsage.replace("Ali",text))

return res.sendStatus(200)

}

/* USAGE TYPE */

if(user.state === "usage"){

if(input.includes("personal")){

await updateUserType(from,"personal")

await updateState(from,"occupation")

await sendMessage(from,msg.personalProfile)

return res.sendStatus(200)

}

if(input.includes("business")){

await updateUserType(from,"business")

await updateState(from,"business_name")

await sendMessage(from,msg.businessProfile)

return res.sendStatus(200)

}

}

/* PERSONAL OCCUPATION */

if(user.state === "occupation"){

await updateOccupation(from,text)

await updateState(from,"dashboard")

await sendMessage(from,msg.accountReady.replace("Ali",user.name))

await sendMessage(from,msg.dashboard.replace("Ali",user.name))

return res.sendStatus(200)

}

/* BUSINESS NAME */

if(user.state === "business_name"){

await updateBusinessName(from,text)

await updateState(from,"dashboard")

await sendMessage(from,msg.accountReady.replace("Ali",user.name))

await sendMessage(from,msg.dashboard.replace("Ali",user.name))

return res.sendStatus(200)

}

/* DASHBOARD COMMAND */

if(input === "menu"){

await sendMessage(from,msg.dashboard.replace("Ali",user.name))

return res.sendStatus(200)

}

/* PLANS */

if(input === "plans"){

await sendMessage(from,msg.plans)

return res.sendStatus(200)

}

/* REPORT */

if(input === "report"){

if(user.user_type === "business"){

await sendMessage(from,msg.businessReport)

}else{

await sendMessage(from,msg.personalReport)

}

return res.sendStatus(200)

}

/* SALE */

if(input.startsWith("sale")){

await sendMessage(from,msg.saleRecorded)

return res.sendStatus(200)

}

/* EXPENSE */

if(input.startsWith("expense")){

await sendMessage(from,msg.expenseRecorded)

return res.sendStatus(200)

}

/* UDHAR */

if(input.startsWith("udhar")){

await sendMessage(from,msg.udharRecorded)

await updateState(from,"ask_receipt")

return res.sendStatus(200)

}

/* RECEIPT YES / NO */

if(user.state === "ask_receipt"){

if(input === "yes"){

await updateState(from,"customer_number")

await sendMessage(from,msg.askCustomerNumber)

return res.sendStatus(200)

}

if(input === "no"){

await updateState(from,"dashboard")

await sendMessage(from,msg.dashboard.replace("Ali",user.name))

return res.sendStatus(200)

}

}

/* CUSTOMER NUMBER */

if(user.state === "customer_number"){

await sendMessage(text,msg.customerReceipt)

await sendMessage(from,msg.receiptConfirmation)

await updateState(from,"dashboard")

return res.sendStatus(200)

}

/* DEFAULT */

await sendMessage(from, String(msg.dashboard).replace("{user}", userName))

return res.sendStatus(200)

}catch(error){

console.error("ERROR:",error)

res.sendStatus(500)

}

})

/* SERVER */

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
console.log("Hisabi Cash server running on port",PORT)
})