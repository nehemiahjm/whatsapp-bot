const axios = require("axios")

const TOKEN = process.env.WHATSAPP_TOKEN
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID

async function sendMessage(to, message){

if(!message){
console.log("⚠ Empty message prevented")
return
}

await axios.post(
`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
{
messaging_product: "whatsapp",
to: to,
type: "text",
text: {
body: message
}
},
{
headers:{
Authorization:`Bearer ${TOKEN}`,
"Content-Type":"application/json"
}
}
)

}

module.exports = { sendMessage }
