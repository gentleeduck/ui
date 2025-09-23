import { useField } from '@tanstack/react-form'
import React from 'react'
import { FormContext, FormItemContext } from './tanstack-form'

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

  return {
    error: field.state.meta.errors?.[0] as never as Error,
    errors: field.state.meta.errors as never as Error[],
    formDescriptionId: `${fieldContext.name}-form-item-description`,
    formItemId: `${fieldContext.name}-form-item`,
    formMessageId: `${fieldContext.name}-form-item-message`,
    handleChange: field.handleChange,
    state: field.state,
  }
}

export type Error = {
  message: string
  type: string
  path: string[]
}
