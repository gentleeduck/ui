import type { AppAction, AppResource } from '@blogduck/shared'
import { createTypedAuthorize } from '@gentleduck/iam/server/nest'

export const Authorize = createTypedAuthorize<AppAction, AppResource>()
