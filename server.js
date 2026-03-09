require("dotenv").config()

const express = require("express")
const { sendMessage } = require("./whatsapp")

const pool = require("./database/postgres")

const {
findUser,
createUser,
updateLanguage
} = require("./services/userService")

const {
recordSale,
recordExpense,
recordUdhar,
getReport
} = require("./services/financeService")

const english = require("./messages/english")
const roman = require("./messages/roman")
const urdu = require("./messages/urdu")

const app = express()
app.use(express.json())

/* ROOT */

app.get("/", (req,res)=>{
res.send("Hisabi Cash Bot Running")
})

/* WEBHOOK VERIFY */

app.get("/webhook",(req,res)=>{

const verify_token = "hisabi_verify_token"

const mode = req.query["hub.mode"]
const token = req.query["hub.verify_token"]
const challenge = req.query["hub.challenge"]

if(mode && token === verify_token){

return res.status(200).send(challenge)

}else{

return res.sendStatus(403)

}

})

/* MAIN BOT */

app.post("/webhook", async (req,res)=>{

try{

const entry = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]

if(!entry) return res.sendStatus(200)

/* CLEAN PHONE NUMBER */

const from = entry.from.replace("@c.us","")

const text = entry.text?.body?.trim()

if(!text) return res.sendStatus(200)

/* USER */

let user = await findUser(from)

if(!user){

user = await createUser(from)

await sendMessage(from, english.welcome)

return res.sendStatus(200)

}

/* LANGUAGE */

let lang = user.language || "english"

let msg

if(lang === "english") msg = english
if(lang === "roman") msg = roman
if(lang === "urdu") msg = urdu

const message = text.toLowerCase()

/* MENU */

if(message === "menu"){

await sendMessage(from,msg.dashboard("User"))

return res.sendStatus(200)

}

/* PLANS */

if(message === "plans"){

await sendMessage(from,msg.plans)

return res.sendStatus(200)

}

/* SALE */

if(message.startsWith("sale")){

const parts = message.split(" ")

const amount = parseInt(parts[1])
const item = parts.slice(2).join(" ")

if(!amount){

await sendMessage(from,"Example: SALE 500 tea")

return res.sendStatus(200)

}

await recordSale(from,amount,item)

await sendMessage(from,msg.saleRecorded + "\nAmount: Rs " + amount)

return res.sendStatus(200)

}

/* EXPENSE */

if(message.startsWith("expense")){

const parts = message.split(" ")

const amount = parseInt(parts[1])
const item = parts.slice(2).join(" ")

if(!amount){

await sendMessage(from,"Example: EXPENSE 200 milk")

return res.sendStatus(200)

}

await recordExpense(from,amount,item)

await sendMessage(from,msg.expenseRecorded + "\nAmount: Rs " + amount)

return res.sendStatus(200)

}

/* UDHAR */

if(message.startsWith("udhar")){

const parts = message.split(" ")

const amount = parseInt(parts[1])
const person = parts.slice(2).join(" ")

if(!amount){

await sendMessage(from,"Example: UDHAR 1000 Ahmed")

return res.sendStatus(200)

}

await recordUdhar(from,amount,person)

await sendMessage(from,msg.udharRecorded + "\nAmount: Rs " + amount)

return res.sendStatus(200)

}

/* REPORT */

if(message.startsWith("report")){

let type = "today"

if(message.includes("week")) type = "week"
if(message.includes("month")) type = "month"

const report = await getReport(from,type)

const sales = report.sales
const expenses = report.expenses
const udhar = report.udhar

const profit = sales - expenses
const cash = sales - expenses - udhar

const reportText =
`📊 Hisabi Cash Report

💰 Sales: Rs ${sales}
📉 Expenses: Rs ${expenses}
📈 Profit: Rs ${profit}

📒 Udhar Given: Rs ${udhar}

💵 Net Cash Flow: Rs ${cash}`

await sendMessage(from,reportText)

return res.sendStatus(200)

}

/* UNKNOWN */

await sendMessage(from,msg.help)

return res.sendStatus(200)

}catch(error){

console.error(error)

res.sendStatus(500)

}

})

/* SERVER */

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{

console.log("Hisabi Cash Server running on",PORT)

})
