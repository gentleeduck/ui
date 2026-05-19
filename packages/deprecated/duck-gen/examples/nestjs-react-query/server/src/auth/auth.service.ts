import { Injectable } from '@nestjs/common'
import type { SignInBody } from './auth.types'

@Injectable()
export class AuthService {
  async signIn(_body: SignInBody) {
    const user = { username: 'duck', password: 'quack', token: 'token-123' }
    return {
      ok: false,
      message: 'AUTH_SIGNIN_LOCKED',
      token: {
        user,
        accessToken: 'token-123',
      },
    }
  }
}
