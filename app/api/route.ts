import { type NextRequest } from 'next/server'

const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request: NextRequest) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const data = await request.json()

  const { message } = data

  const result = await model.generateContent(
    `Convert ${message} into polite conversational words and return only the message without reason by thai language`
  )

  const response = await result.response

  const text = response.text()

  return new Response(
    JSON.stringify({
      message: 'Success',
      data: {
        result: text,
      },
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}
