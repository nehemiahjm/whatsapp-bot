import axios from "axios"

const TOKEN = process.env.WHATSAPP_TOKEN
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID


export async function sendMessage(to, message){

try{

await axios.post(
`https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
{
messaging_product:"whatsapp",
to:to,
type:"text",
text:{ body: message }
},
{
headers:{
Authorization:`Bearer ${TOKEN}`,
"Content-Type":"application/json"
}
}
)

}catch(err){

console.log("Send message error:",err.response?.data || err)

}

}