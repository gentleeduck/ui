import { engine } from '@blogduck/shared'
import { createEngineProvider } from '@gentleduck/iam/server/nest'
import { Global, Module } from '@nestjs/common'
import { AccessGuard } from './access.guard'

const engineProvider = createEngineProvider(() => engine)

@Global()
@Module({
  providers: [engineProvider, AccessGuard],
  exports: [engineProvider, AccessGuard],
})
export class AccessModule {}
