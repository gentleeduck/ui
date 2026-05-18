import { type AppAction, type AppResource, CHECKS } from '@blogduck/shared'
import type { Engine } from '@gentleduck/iam'
import { generatePermissionMap } from '@gentleduck/iam/server/generic'
import { ACCESS_ENGINE_TOKEN } from '@gentleduck/iam/server/nest'
import { Controller, Get, Inject, Req, UnauthorizedException } from '@nestjs/common'
import type { Request } from 'express'

@Controller('permissions')
export class PermissionsController {
  constructor(@Inject(ACCESS_ENGINE_TOKEN) private readonly engine: Engine<AppAction, AppResource>) {}

  @Get()
  async getPermissions(@Req() req: Request) {
    const userId = req.headers['x-user-id']
    if (typeof userId !== 'string') throw new UnauthorizedException()

    return generatePermissionMap(this.engine, userId, CHECKS)
  }
}
