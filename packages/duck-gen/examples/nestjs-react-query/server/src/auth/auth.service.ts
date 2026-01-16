import { Injectable } from '@nestjs/common'
import type { SignInBody, SignInResponse } from './auth.types'

@Injectable()
export class AuthService {
  private readonly users = [{ username: 'duck', password: 'quack', token: 'token-123' }]

  async signIn(body: SignInBody): Promise<SignInResponse> {
    if (body.username === 'locked') {
      return { ok: false, message: 'AUTH_SIGNIN_LOCKED', token: null }
    }

    const match = this.users.find((user) => user.username === body.username)
    if (!match || match.password !== body.password) {
      return { ok: false, message: 'AUTH_SIGNIN_INVALID_CREDENTIALS', token: null }
    }

    return { ok: true, message: 'AUTH_SIGNIN_SUCCESS', token: match.token }
  }
}
