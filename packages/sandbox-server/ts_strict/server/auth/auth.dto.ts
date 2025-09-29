import z from 'zod'
import { AuthMessagesType } from './auth.types'

const errorMessage = <T extends AuthMessagesType>(message: T) => ({ message })

export const signinSchema = z.object({
  email: z.string().email({ ...errorMessage('ZOD_EXPECTED_STRING') }),
  password: z.string().min(6, { ...errorMessage('ZOD_EXPECTED_STRING') }),
})
export type SigninSchemaDto = z.infer<typeof signinSchema>
