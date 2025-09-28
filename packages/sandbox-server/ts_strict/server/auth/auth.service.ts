import { throwError } from '../libs/error'
import { SigninSchema } from './auth.dto'
import { AuthMessagesType } from './auth.types'

export async function singin(data: SigninSchema) {
  // do some db right here
  const user = data
  return user
}
