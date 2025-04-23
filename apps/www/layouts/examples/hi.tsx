'use client'

import { Button } from '@gentelduck/registry-ui-duckui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@gentelduck/registry-ui-duckui/form'
import { Input } from '@gentelduck/registry-ui-duckui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gentelduck/registry-ui-duckui/select'
import { Textarea } from '@gentelduck/registry-ui-duckui/textarea'
import { toast } from 'sonner'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Calendar } from '@gentelduck/registry-ui-duckui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@gentelduck/registry-ui-duckui/popover'
import { cn } from '@gentelduck/libs/cn'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@gentelduck/registry-ui-duckui/sheet'
import { Label } from '@gentelduck/registry-ui-duckui/label'

const FormSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone: z
    .string()
    .min(10, {
      message: 'Phone number must be at least 10 digits.',
    })
    .regex(/^\d+$/, {
      message: 'Phone number must contain only digits.',
    }),
  dateOfBirth: z.date({
    required_error: 'Please select a date of birth.',
  }),
  gender: z.string({
    required_error: 'Please select a gender.',
  }),
  address: z.string().min(5, {
    message: 'Address must be at least 5 characters.',
  }),
})

type FormValues = z.infer<typeof FormSchema>

export function VaulDrawer() {
  return (
    <Sheet>
      <SheetTrigger variant='outline'>Open</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Name
            </Label>
            <Input id='name' value='Pedro Duarte' className='col-span-3' />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='username' className='text-right'>
              Username
            </Label>
            <Input id='username' value='@peduarte' className='col-span-3' />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type='submit'>Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
