import { Body, Controller, Get, Post } from '@nestjs/common'
import type { AuthService } from './auth.service'
import type { DeepType, SignInBody, SignInResponse } from './auth.types'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() body: SignInBody) {
    return this.authService.signIn(body)
  }

  @Get('deep-test')
  async deepTest(): Promise<DeepType> {
    return {} as any
  }

  @Get('dup')
  async dupGet() {
    return {
      post_duck: {
        name: 'duck',
        method: 'POST',
      },
    }
  }

  @Post('dup')
  async dupPost() {
    return {
      post_duck: {
        name: 'duck',
        method: 'POST',
      },
    }
  }
}
