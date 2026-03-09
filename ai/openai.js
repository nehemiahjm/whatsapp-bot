const OpenAI = require("openai")

const client = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
})

async function detectTransaction(message){

const prompt = `
You are a financial transaction parser for a business accounting system.

Extract transaction details from the user's message.

Important rules:
- Only return clean item or person names.
- Remove words like sold, bought, bechi, diya, liya.
- For sales and expenses return the product name only.
- For udhar return the person's name only.

Examples:

"I sold tea for 500"
→ {"type":"sale","amount":500,"description":"tea"}

"500 ki chai bechi"
→ {"type":"sale","amount":500,"description":"chai"}

"Bought milk for 200"
→ {"type":"expense","amount":200,"description":"milk"}

"Ahmed ko 1000 udhar diya"
→ {"type":"udhar","amount":1000,"description":"Ahmed"}

Return JSON only in this format:

{
"type":"sale | expense | udhar | none",
"amount": number,
"description":"text"
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