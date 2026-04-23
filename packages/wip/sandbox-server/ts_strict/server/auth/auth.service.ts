import type { SigninSchemaDto } from './auth.dto'

export async function singin(data: SigninSchemaDto) {
  // do some db right here
  const user = data
  return user
}
