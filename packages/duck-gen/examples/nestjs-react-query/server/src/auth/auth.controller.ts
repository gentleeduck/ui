import { Body, Controller, Post } from '@nestjs/common'
import type { AuthService } from './auth.service'
import type { SignInBody, SignInResponse } from './auth.types'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() body: SignInBody) {
    return this.authService.signIn(body)
  }
}
