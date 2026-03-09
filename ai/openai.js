const OpenAI = require("openai")

const client = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
})

async function detectTransaction(message){

const prompt = `
You are a financial parser.

Extract transaction details from the message.

Return JSON ONLY in this format:

{
"type": "sale | expense | udhar | none",
"amount": number,
"description": "short text"
}

User message: "${message}"
`

const response = await client.chat.completions.create({
model: "gpt-4o-mini",
messages: [
{ role: "system", content: "Extract financial transaction info." },
{ role: "user", content: prompt }
],
temperature: 0
})

try{
return JSON.parse(response.choices[0].message.content)
}catch{
return { type:"none" }
}

}

module.exports = { detectTransaction }