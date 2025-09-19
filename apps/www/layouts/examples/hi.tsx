'use client'

import { cn } from '@gentleduck/libs/cn'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Calendar } from '@gentleduck/registry-ui-duckui/calendar'
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@gentleduck/registry-ui-duckui/form'
import { Input } from '@gentleduck/registry-ui-duckui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@gentleduck/registry-ui-duckui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@gentleduck/registry-ui-duckui/select'
import { Textarea } from '@gentleduck/registry-ui-duckui/textarea'
import { useForm } from '@tanstack/react-form'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

const FormSchema = z.object({
  address: z.string().min(5, {
    message: 'Address must be at least 5 characters.',
  }),
  dateOfBirth: z.date({
    required_error: 'Please select a date of birth.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  gender: z.string({
    required_error: 'Please select a gender.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  phone: z
    .string()
    .min(10, {
      message: 'Phone number must be at least 10 digits.',
    })
    .regex(/^\d+$/, {
      message: 'Phone number must contain only digits.',
    }),
})

type FormValues = z.infer<typeof FormSchema>

export function VaulDrawer() {
  const form = useForm({
    defaultValues: {
      address: '',
      dateOfBirth: new Date(),
      email: '',
      firstName: '',
      gender: '',
      lastName: '',
      phone: '',
    },
    onSubmit: ({ value }) => {
      const result = FormSchema.safeParse(value)
      if (result.success) {
        console.log(result.data)
        toast.success(`User information submitted successfully!`)
      } else {
        toast.error('Invalid form data')
      }
    },
    onSubmitInvalid: ({ value, formApi }) => {
      toast.error('Please correct the errors in the form')
    },
    validators: {
      onSubmit: FormSchema,
    },
  })

  return (
    <Form
      className="w-[490px] flex flex-col gap-4 p-8 border rounded-xl shadow"
      form={form}
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField form={form} name="firstName">
          {(field) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <Input
                onChange={(e) => field.handleChange(e.currentTarget.value)}
                placeholder="John"
                value={field.state.value as string}
              />
              <FormMessage />
            </FormItem>
          )}
        </FormField>

        <FormField form={form} name="lastName">
          {(field) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <Input
                onChange={(e) => field.handleChange(e.currentTarget.value)}
                placeholder="Doe"
                value={field.state.value as string}
              />
              <FormMessage />
            </FormItem>
          )}
        </FormField>
      </div>

      <FormField form={form} name="email">
        {(field) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <Input
              onChange={(e) => field.handleChange(e.currentTarget.value)}
              placeholder="john.doe@example.com"
              type="email"
              value={field.state.value as string}
            />
            <FormMessage />
          </FormItem>
        )}
      </FormField>

      <FormField form={form} name="phone">
        {(field) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <Input
              onChange={(e) => field.handleChange(e.currentTarget.value)}
              placeholder="1234567890"
              value={field.state.value as string}
            />
            <FormMessage />
          </FormItem>
        )}
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
        <FormField form={form} name="dateOfBirth">
          {(field) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className={cn(
                      'w-full justify-start text-left font-normal h-10',
                      !field.state.value && 'text-muted-foreground',
                    )}
                    icon={<CalendarIcon className="mr-2" />}
                    variant={'outline'}>
                    {field.state.value ? format(field.state.value as Date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    initialFocus
                    mode="single"
                    onSelect={(date) => field.handleChange(date)}
                    selected={field.state.value as Date}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        </FormField>

        <FormField form={form} name="gender">
          {(field) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.handleChange} value={field.state.value as string}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        </FormField>
      </div>

      <FormField form={form} name="address">
        {(field) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <Textarea
              onChange={(e) => field.handleChange(e.currentTarget.value)}
              placeholder="123 Main St, City, Country"
              rows={3}
              value={field.state.value as string}
            />
            <FormMessage />
          </FormItem>
        )}
      </FormField>

      <Button className="w-full" type="submit">
        Submit Information
      </Button>
    </Form>
  )
}
