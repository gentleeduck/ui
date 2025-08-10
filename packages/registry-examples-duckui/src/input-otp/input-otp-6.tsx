'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@gentleduck/registry-ui-duckui/form-react-hook'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@gentleduck/registry-ui-duckui/input-otp'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: 'Your one-time password must be 6 characters.',
  }),
})

export default function InputOTPForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: '',
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast('You submitted the following values', {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field} onValueChange={field.onChange}>
                  <InputOTPGroup>
                    <InputOTPSlot />
                    <InputOTPSlot />
                    <InputOTPSlot />
                    <InputOTPSlot />
                    <InputOTPSlot />
                    <InputOTPSlot />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>Please enter the one-time password sent to your phone.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
