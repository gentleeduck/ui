import { Injectable } from '@nestjs/common'
import type { SignInBody, SignInResponse } from './auth.types'

@Injectable()
export class AuthService {
  private readonly users = [{ username: 'duck', password: 'quack', token: 'token-123' }]

  async signIn(body: SignInBody) {
    let user = { username: 'duck', password: 'quack', token: 'token-123' }
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
