import z from 'zod'

export function throwError<T extends string>(string: T, cause?: string): Error {
  throw new Error(string, {
    cause,
  })
}

export function returnMessage<T extends AuthMessagesType, U extends unknown = null>(
  data: U,
  message: T,
  status: 'success' | 'error',
) {
  return { data, message, status }
}

export type AuthMessagesType = (typeof AuthMessages)[number]

const errorMessage = <T extends AuthMessagesType>(message: T) => ({ message })

/////////////////////////

// .constants.ts file
export const AuthMessages = [
  // SUCCESS
  'AUTH_SIGNIN_SUCCESS',

  // ERROR
  'AUTH_SIGNIN_ERROR',

  //ZOD
  'ZOD_EXPECTED_STRING',
] as const

// dto.ts file
const signinSchema = z.object({
  email: z.string().email({ ...errorMessage('ZOD_EXPECTED_STRING') }),
  password: z.string().min(6, { ...errorMessage('ZOD_EXPECTED_STRING') }),
})
export type SigninSchema = z.infer<typeof signinSchema>

// controller.ts file
export function signin_controller({ data }: { data: SigninSchema }) {
  try {
    const user_data = signinSchema.parse(data)
    return returnMessage<AuthMessagesType, SigninSchema>(user_data, 'AUTH_SIGNIN_SUCCESS', 'success')
  } catch (error) {
    return returnMessage<AuthMessagesType>(null, 'AUTH_SIGNIN_ERROR', 'error')
  }
}

// service.ts file
function singin(data: SigninSchema) {
  try {
    signinSchema.parse(data)
  } catch (error) {
    console.log(error)
    return throwError<AuthMessagesType>('AUTH_SIGNIN_ERROR')
  }
}
