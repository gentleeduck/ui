'use client'

import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@gentelduck/registry-ui-duckui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@gentelduck/registry-ui-duckui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gentelduck/registry-ui-duckui/select'
import { toast } from 'sonner'

const FormSchema = z.object({
  email: z
    .string({
      required_error: 'Please select an email to display.',
    })
    .email(),
})

export default function SelectForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.info(
      <div>
        <h4 className='text-lg font-medium'>
          You submitted the following values:
        </h4>
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>,
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-2/3 space-y-6'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a verified email to display' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='m@example.com'>m@example.com</SelectItem>
                  <SelectItem value='m@google.com'>m@google.com</SelectItem>
                  <SelectItem value='m@support.com'>m@support.com</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can manage email addresses in your{' '}
                <Link href='/examples/forms'>email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  )
}
