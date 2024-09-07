"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { useState } from 'react'

const FormSchema = z.object({
  message: z.string().max(1000, {
    message: 'Message must not be longer than 1,000 characters.',
  }),
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
    <main className="min-h-screen p-24">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Message for convert" className="resize-none" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Convert</Button>
        </form>
      </Form>

      {fetchState.isFetching ? <div>Loading...</div> : fetchState.result}
    </main>
  )
}
