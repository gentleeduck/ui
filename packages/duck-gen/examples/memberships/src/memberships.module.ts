import { Module } from '@nestjs/common'
import { MembershipsAdminController } from './memberships.admin.controller'
import { MembershipsAdminService } from './memberships.admin.service'

@Module({
  controllers: [MembershipsAdminController],
  providers: [MembershipsAdminService],
  exports: [MembershipsAdminService],
})
export class MembershipsModule {}
