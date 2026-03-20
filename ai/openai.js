const OpenAI = require("openai")

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function detectTransaction(message){

  const prompt = `
You are a financial AI assistant for a WhatsApp accounting system.

Your job is to extract structured transaction data.

Understand English, Roman Urdu, and Urdu.

Rules:
- Return ONLY valid JSON (no text, no explanation)
- Keep description clean (only item or person name)
- Remove extra words like: sold, bechi, diya, liya, bought
- If not a transaction → return type "unknown"

Supported types:
- sale
- expense
- udhar
- udhar_paid
- report
- unknown

Examples:

"I sold tea for 500"
→ {"type":"sale","amount":500,"description":"tea"}

"500 ki chai bechi"
→ {"type":"sale","amount":500,"description":"chai"}

"Bought milk for 200"
→ {"type":"expense","amount":200,"description":"milk"}

"Ahmed ko 1000 udhar diya"
→ {"type":"udhar","amount":1000,"description":"Ahmed"}

"Ahmed ne paise de diye"
→ {"type":"udhar_paid","description":"Ahmed"}

"show report"
→ {"type":"report"}

Return format:

{
"type":"sale | expense | udhar | udhar_paid | report | unknown",
"amount": number,
"description":"text"
}

User message: "${message}"
`

  try{

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Extract financial transaction info." },
        { role: "user", content: prompt }
      ],
      temperature: 0
    })

    let content = response.choices[0].message.content

    // 🔥 CLEAN JSON (very important)
    content = content.replace(/```json|```/g, "").trim()

    const parsed = JSON.parse(content)

    // 🔥 SAFE DEFAULTS
    return {
      type: parsed.type || "unknown",
      amount: parsed.amount || 0,
      description: parsed.description || ""
    }

  } catch (err){

    console.error("AI Parse Error:", err.message)

    return { type:"unknown", amount:0, description:"" }
  }
}

module.exports = { detectTransaction }