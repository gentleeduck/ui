import type { AppAction, AppResource } from '@blogduck/shared'
import type { Engine } from '@gentleduck/iam'
import { ACCESS_ENGINE_TOKEN, nestAccessGuard } from '@gentleduck/iam/server/nest'
import { type CanActivate, type ExecutionContext, Inject, Injectable } from '@nestjs/common'

@Injectable()
export class AccessGuard implements CanActivate {
  private check: (context: ExecutionContext) => Promise<boolean>

  constructor(@Inject(ACCESS_ENGINE_TOKEN) engine: Engine<AppAction, AppResource>) {
    this.check = nestAccessGuard(engine, {
      getUserId: (req) => (req.headers?.['x-user-id'] as string) ?? null,
    })
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return this.check(context)
  }
}
