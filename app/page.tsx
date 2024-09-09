"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { useState } from 'react'

const FormSchema = z.object({
  message: z.string()
    .max(1000, {
      message: 'Message must not be longer than 1,000 characters.',
    })
})

interface FetchState {
  result: string | null
  isFetching: boolean
}

export default function Home() {
  const [fetchState, setFetchState] = useState<FetchState>({
    result: null,
    isFetching: false,
  })
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setFetchState((prevState) => ({
      ...prevState,
      isFetching: true,
    }))
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: data.message,
        }),
      })
      const responseData = await response.json()

      setFetchState((prevState) => ({
        ...prevState,
        result: responseData.data.result,
      }))
    } catch (error) {
    } finally {
      setFetchState((prevState) => ({
        ...prevState,
        isFetching: false,
      }))
    }
  }

  return (
    <main className="min-h-screen p-24 transition-colors duration-300 bg-gradient-to-br from-blue-400 to-purple-500">
      <h1 className="text-center text-4xl font-semibold text-white mb-4">Tone Transform</h1>
      <div className='flex justify-center '>
        <div className='w-[500px]'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
              <FormField
                control={form.control}
                name="message"

                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-white'>ข้อความ</FormLabel>
                    <FormControl>
                      <Textarea placeholder="ข้อความที่ต้องการแปลง" className="resize-none bg-white" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className={`bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold`}
              >
                {fetchState.isFetching ? 'กำลังแปลงข้อความ...' : 'แปลงข้อความ'}
              </Button>
            </form>
          </Form>
          <div className='mt-3'>
            <p className='text-white'>{fetchState.isFetching ? 'Loading' : fetchState.result}</p>
          </div>
        </div>
      </div>



    </main>
  )
}
