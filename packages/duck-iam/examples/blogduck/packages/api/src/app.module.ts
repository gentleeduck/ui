import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { AccessGuard } from './access/access.guard'
import { AccessModule } from './access/access.module'
import { PermissionsModule } from './permissions/permissions.module'
import { PostsModule } from './posts/posts.module'

@Module({
  imports: [AccessModule, PostsModule, PermissionsModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessGuard,
    },
  ],
})
export class AppModule {}
