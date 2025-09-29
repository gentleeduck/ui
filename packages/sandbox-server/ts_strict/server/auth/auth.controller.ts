import { ResponseType } from '../libs/response'
import { AuthMessages } from './auth.constants'
import { SigninSchemaDto, signinSchema } from './auth.dto'
import { singin } from './auth.service'

export async function auth_signin({
  data,
}: {
  data: SigninSchemaDto
}): Promise<ResponseType<Awaited<ReturnType<typeof singin>>, typeof AuthMessages>> {
  try {
    const user_data = signinSchema.parse(data)
    const user = await singin(user_data)

    if (user instanceof Error) {
      return { message: 'AUTH_SIGNIN_ERROR', state: 'error' }
    }

    return { data: user, message: 'AUTH_SIGNIN_SUCCESS', state: 'success' }
  } catch (error) {
    return { message: 'AUTH_SIGNIN_ERROR', state: 'error' }
  }
}

export function auth_signup() {
  return { message: 'AUTH_SIGNUP_SUCCESS', state: 'success' }
}

export function auth_signout() {
  return { message: 'AUTH_SIGNOUT_SUCCESS', state: 'success' }
}
