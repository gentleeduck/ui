'use client'

import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@gentleduck/registry-ui-duckui/form-react-hook'
import { RadioGroup, RadioGroupItem } from '@gentleduck/registry-ui-duckui/radio-group'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  type: z.enum(['all', 'mentions', 'none'], {
    required_error: 'You need to select a notification type.',
  }),
})

export default function RadioGroupDemo() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.info(
      <div>
        <h4 className="font-medium text-md">You submitted the following values:</h4>
        <pre className="mt-2 w-[300px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>,
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Notify me about...</FormLabel>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                <RadioGroupItem value="all">All new messages</RadioGroupItem>
                <RadioGroupItem value="mentions">Direct messages and mentions</RadioGroupItem>
                <RadioGroupItem value="none">Nothing</RadioGroupItem>
              </RadioGroup>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
