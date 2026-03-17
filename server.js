import express from "express"
import bodyParser from "body-parser"
import { handleWebhook } from "./whatsapp.js"

const app = express()

app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.send("Hisabi Cash Bot Running")
})

app.post("/webhook", async (req, res) => {

    try {

        await handleWebhook(req, res)

    } catch (error) {

        console.error("❌ Webhook Error:", error.message)

        res.sendStatus(200) // prevent crash

    }

})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`🚀 Hisabi Cash running on port ${PORT}`)
})