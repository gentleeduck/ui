import { throwError } from '../libs/error'
import { SigninSchemaDto } from './auth.dto'
import { AuthMessagesType } from './auth.types'

export async function singin(data: SigninSchemaDto) {
  // do some db right here
  const user = data
  return user
}
