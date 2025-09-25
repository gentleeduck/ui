// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.

import { signin_controller } from './index-server'

export interface ApiRoutes {
  '/api/auth/signin': { req: Parameters<typeof signin_controller>[0]; res: ReturnType<typeof signin_controller> }
  '/api/auth/signup': { req: Parameters<typeof signin_controller>[0]; res: ReturnType<typeof signin_controller> }
}
