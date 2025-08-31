import { useField } from '@tanstack/react-form'
import React from 'react'
import { FormContext, FormItemContext } from './form'

export function useFormContext() {
  const formContext = React.useContext(FormContext)
  if (!formContext) {
    throw new Error('useFormContext should be used within <Form>')
  }
  return { ...formContext }
}

// Define a more generic return type that doesn't depend on specific TanStack types
export function useFormField() {
  const { form } = useFormContext()
  const fieldContext = React.useContext(FormItemContext)
  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormItem>')
  }

  const field = useField({ form, name: fieldContext.name })
  console.log(field.state.meta.errors, 'hi')

  return {
    error: field.state.meta.errors?.[0] as never as Error,
    errors: field.state.meta.errors as never as Error[],
    formItemId: `${fieldContext.name}-form-item`,
    formDescriptionId: `${fieldContext.name}-form-item-description`,
    formMessageId: `${fieldContext.name}-form-item-message`,
    state: field.state,
    handleChange: field.handleChange,
  }
}

export type Error = {
  message: string
  type: string
  path: string[]
}
