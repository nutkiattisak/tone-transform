import { type NextRequest } from 'next/server'

const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function GET(request: NextRequest) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const message = 'ฉันยังยุ่งอยู่ ไม่อยากออกไปตอนนี้'

  const result = await model.generateContent(`แปลงคำว่า ${message} ให้เป็นคำสุภาพที่ใช้ในการสนทนา`)

  const response = await result.response
  const text = response.text()

  return new Response(
    JSON.stringify({
      message: 'Success',
      data: text,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

export async function POST(request: NextRequest) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const data = await request.json()

  const { message } = data

  console.log(message)

  const result = await model.generateContent(`แปลงคำว่า ${message} ให้เป็นคำสุภาพที่ใช้ในการสนทนา`)

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
