// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.

import { auth_signin, auth_signup, auth_signout } from './server/auth/auth.controller'
import { AuthMessages } from './server/auth/auth.constants'

export interface ApiRoutes {
  '/api/auth/signin': {
    req: Parameters<typeof auth_signin>[0]
    res: Awaited<ReturnType<typeof auth_signin>>
    method: 'POST'
    router: 'auth'
  }
  '/api/auth/signup': {
    req: Parameters<typeof auth_signup>[0]
    res: Awaited<ReturnType<typeof auth_signup>>
    method: 'POST'
    router: 'auth'
  }
  '/api/auth/signout': {
    req: Parameters<typeof auth_signout>[0]
    res: Awaited<ReturnType<typeof auth_signout>>
    method: 'POST'
    router: 'auth'
  }
}

export type AuthMessagesType = (typeof AuthMessages)[number]
export type I18AuthMessages = Record<AuthMessagesType, string>

export type GetRes<T extends keyof ApiRoutes> = ApiRoutes[T]['res']
export type GetReq<T extends keyof ApiRoutes> = ApiRoutes[T]['req']
