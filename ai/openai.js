const OpenAI = require("openai")

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function detectIntent(message) {

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: "Extract financial intent: sale, expense, udhar"
      },
      {
        role: "user",
        content: message
      }
    ]
  })

  return response.choices[0].message.content
}

module.exports = { detectIntent }