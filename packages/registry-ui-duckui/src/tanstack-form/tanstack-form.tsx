// 'use client'
//
// import * as React from 'react'
//
// import { Field, type useForm } from '@tanstack/react-form'
// import type { ReactFormExtendedApi } from '@tanstack/react-form'
//
// import { cn } from '@gentleduck/libs/cn'
// import { Label } from '../label'
// import { useFormField } from './form.hooks'
// import { Circle } from 'lucide-react'
//
// export const FormItemContext = React.createContext<{
//   id: string
//   name: string
// } | null>(null)
//
// export const FormContext = React.createContext<{
//   form: ReturnType<typeof useForm>
// } | null>(null)
//
// function Form<TForm extends ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any>>({
//   ref,
//   form,
//   ...props
// }: React.ComponentProps<'form'> & { form: TForm }) {
//   return (
//     <FormContext.Provider value={{ form }}>
//       <form {...props} ref={ref} />
//     </FormContext.Provider>
//   )
// }
//
// const FormField = <
//   TForm extends ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any>,
//   TName extends React.ComponentProps<TForm['Field']>['name'],
// >({
//   name,
//   form,
//   ...props
// }: Omit<React.ComponentProps<typeof Field>, 'form' | 'name'> & {
//   form: TForm
//   name: TName
// }) => {
//   const id = React.useId()
//
//   return (
//     <FormItemContext.Provider value={{ id, name }}>
//       <Field form={form} name={name} {...props} />
//     </FormItemContext.Provider>
//   )
// }
//
// const FormItem = ({ className, ref, ...props }: React.HTMLProps<HTMLDivElement>) => {
//   return <div ref={ref} className={cn('flex flex-col gap-2', className)} {...props} />
// }
//
// const FormLabel = ({ className, htmlFor, ref, ...props }: React.ComponentPropsWithRef<typeof Label>) => {
//   const { formItemId, error } = useFormField()
//   return (
//     <Label
//       ref={ref}
//       htmlFor={htmlFor ?? formItemId}
//       className={cn(error && 'text-destructive', className)}
//       {...props}
//     />
//   )
// }
//
// const FormDescription = ({ className, ref, ...props }: React.HTMLProps<HTMLParagraphElement>) => {
//   const { formDescriptionId } = useFormField()
//
//   return <p ref={ref} id={formDescriptionId} className={cn('text-muted-foreground text-sm', className)} {...props} />
// }
//
// const FormMessage = ({ className, children, ref, ...props }: React.HTMLProps<HTMLParagraphElement>) => {
//   const { error, formMessageId } = useFormField()
//   const body = error ? String(error.message) : children
//   console.log(error)
//
//   if (!body) {
//     return null
//   }
//
//   return (
//     <p ref={ref} id={formMessageId} className={cn('font-medium text-destructive text-sm', className)} {...props}>
//       {body}
//     </p>
//   )
// }
//
// function FormMultiMessage({
//   className,
//   ref,
//   errors_keys,
//   ...props
// }: React.HTMLProps<HTMLDivElement> & {
//   errors_keys: string[]
// }) {
//   const { formMessageId, errors } = useFormField()
//
//   return (
//     <div
//       ref={ref}
//       id={formMessageId}
//       className={cn(
//         'overflow-hidden transition-all duration-300 ease-in-out',
//         errors.length ? 'my-1 max-h-[960px] opacity-100' : 'my-0 max-h-0 opacity-0',
//         className,
//       )}
//       {...props}>
//       <ul className="flex flex-col items-start gap-1">
//         {errors_keys.map((rule) => (
//           <li key={rule} className="flex items-center gap-2 text-nowrap">
//             <Circle
//               className={cn(
//                 'size-3 transition-all duration-300 ease-in-out',
//                 errors.length > 0 && errors.some((err) => err.message === rule)
//                   ? 'fill-red-500 stroke-red-500'
//                   : 'fill-green-500 stroke-green-500',
//               )}
//             />
//             <span
//               className={cn(
//                 'text-nowrap text-sm transition-all duration-300 ease-in-out',
//                 errors.length > 0 && errors.some((err) => err.message === rule) ? 'text-red-500' : 'text-green-500',
//               )}>
//               {rule}
//             </span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   )
// }
//
// export { Form, FormItem, FormLabel, FormDescription, FormMessage, FormMultiMessage, FormField }
