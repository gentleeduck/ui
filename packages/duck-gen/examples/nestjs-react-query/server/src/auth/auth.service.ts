import { Injectable } from '@nestjs/common'
import type { SignInBody, SignInResponse } from './auth.types'

@Injectable()
export class AuthService {
  private readonly users = [{ username: 'duck', password: 'quack', token: 'token-123' }]

  async signIn(body: SignInBody): Promise<SignInResponse> {
    if (body.username === 'locked') {
      return { ok: false, message: 'auth.signin.locked', token: null }
    }

    const match = this.users.find((user) => user.username === body.username)
    if (!match || match.password !== body.password) {
      return { ok: false, message: 'auth.signin.invalid_credentials', token: null }
    }

    return { ok: true, message: 'auth.signin.success', token: match.token }
  }
}
