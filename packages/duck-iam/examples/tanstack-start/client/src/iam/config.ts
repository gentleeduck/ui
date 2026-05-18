import { createAccessConfig } from '@gentleduck/iam'
import type { AppCtx } from './types'
import { APP_ACTIONS, APP_RESOURCES, APP_ROLES, APP_SCOPES } from './types'

export const access = createAccessConfig({
  actions: APP_ACTIONS,
  resources: APP_RESOURCES,
  roles: APP_ROLES,
  scopes: APP_SCOPES,
  context: {} as unknown as AppCtx,
})
