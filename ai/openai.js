import OpenAI from "openai"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function detectTransaction(message){

  const prompt = `
You are a financial AI assistant for a WhatsApp accounting system.

Extract transaction details.

Rules:
- Return ONLY JSON
- Clean names only (no extra words)
- Understand English, Roman Urdu, Urdu
- If unclear → type = "unknown"

Types:
sale, expense, udhar, udhar_paid, report, unknown

Examples:

"Kal 500 ki chai bechi"
→ {"type":"sale","amount":500,"description":"chai"}

"Milk liya 300 ka"
→ {"type":"expense","amount":300,"description":"milk"}

"Ahmed ko 2000 udhar diya"
→ {"type":"udhar","amount":2000,"description":"Ahmed"}

"Ahmed ne paise de diye"
→ {"type":"udhar_paid","description":"Ahmed"}

"report dikhao"
→ {"type":"report"}

User: "${message}"
`

  try{

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Extract transaction data" },
        { role: "user", content: prompt }
      ],
      temperature: 0
    })

    let content = response.choices[0].message.content


    content = content.replace(/```json|```/g, "").trim()

    const parsed = JSON.parse(content)


    return {
      type: parsed.type || "unknown",
      amount: parsed.amount || 0,
      description: parsed.description || ""
    }

  } catch (err){

    console.log("AI ERROR:", err.message)

    return { type:"unknown", amount:0, description:"" }
  }
}

