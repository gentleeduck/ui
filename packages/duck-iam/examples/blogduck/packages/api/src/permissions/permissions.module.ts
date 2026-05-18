import { Module } from '@nestjs/common'
import { PermissionsController } from './permissions.controller'

@Module({
  controllers: [PermissionsController],
})
export class PermissionsModule {}
