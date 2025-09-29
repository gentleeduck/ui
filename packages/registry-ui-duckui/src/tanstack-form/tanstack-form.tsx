'use client'

import { cn } from '@gentleduck/libs/cn'
import type { ReactFormExtendedApi } from '@tanstack/react-form'
import { Field, type useForm } from '@tanstack/react-form'
import { Circle } from 'lucide-react'
import * as React from 'react'
import { Label } from '../label'
import { useFormField } from './tanstack-form.hooks'

export const FormItemContext = React.createContext<{
  id: string
  name: string
} | null>(null)

export const FormContext = React.createContext<{
  form: ReturnType<typeof useForm>
} | null>(null)

function Form<TForm extends ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any, any, any>>({
  ref,
  form,
  ...props
}: React.ComponentProps<'form'> & { form: TForm }) {
  return (
    <FormContext.Provider value={{ form }}>
      <form {...props} data-slot="form" ref={ref} />
    </FormContext.Provider>
  )
}

const FormField = <
  TForm extends ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any, any, any>,
  TName extends React.ComponentProps<TForm['Field']>['name'],
>({
  name,
  form,
  ...props
}: Omit<React.ComponentProps<typeof Field>, 'form' | 'name'> & {
  form: TForm
  name: TName
}) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id, name }}>
      <Field form={form} name={name} {...props} data-slot="form-field" />
    </FormItemContext.Provider>
  )
}

const FormItem = ({ className, ref, ...props }: React.HTMLProps<HTMLDivElement>) => {
  return <div className={cn('flex flex-col gap-2', className)} ref={ref} {...props} data-slot="form-item" />
}

const FormLabel = ({ className, htmlFor, ref, ...props }: React.ComponentPropsWithRef<typeof Label>) => {
  const { formItemId, error } = useFormField()
  return (
    <Label
      className={cn(error && 'text-destructive', className)}
      data-slot="form-label"
      htmlFor={htmlFor ?? formItemId}
      ref={ref}
      {...props}
    />
  )
}

const FormDescription = ({ className, ref, ...props }: React.HTMLProps<HTMLParagraphElement>) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      className={cn('text-muted-foreground text-sm', className)}
      id={formDescriptionId}
      ref={ref}
      {...props}
      data-slot="form-description"
    />
  )
}

const FormMessage = ({ className, children, ref, ...props }: React.HTMLProps<HTMLParagraphElement>) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      className={cn('font-medium text-destructive text-sm', className)}
      id={formMessageId}
      ref={ref}
      {...props}
      data-slot="form-message">
      {body}
    </p>
  )
}

function FormMultiMessage({
  className,
  ref,
  errors_keys,
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  errors_keys: string[]
}) {
  const { formMessageId, errors } = useFormField()

  return (
    <div
      className={cn(
        'overflow-hidden transition-all duration-300 ease-in-out',
        errors.length ? 'my-1 max-h-[960px] opacity-100' : 'my-0 max-h-0 opacity-0',
        className,
      )}
      data-slot="form-message"
      id={formMessageId}
      ref={ref}
      {...props}>
      <ul className="flex flex-col items-start gap-1">
        {errors_keys.map((rule) => (
          <li className="flex items-center gap-2 text-nowrap" key={rule}>
            <Circle
              className={cn(
                'size-3 transition-all duration-300 ease-in-out',
                errors.length > 0 && errors.some((err) => err.message === rule)
                  ? 'fill-red-500 stroke-red-500'
                  : 'fill-green-500 stroke-green-500',
              )}
            />
            <span
              className={cn(
                'text-nowrap text-sm transition-all duration-300 ease-in-out',
                errors.length > 0 && errors.some((err) => err.message === rule) ? 'text-red-500' : 'text-green-500',
              )}>
              {rule}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { Form, FormItem, FormLabel, FormDescription, FormMessage, FormMultiMessage, FormField }
