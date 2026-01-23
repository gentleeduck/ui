import type { AuthMessages } from './auth.messages'

export type AuthMessage = (typeof AuthMessages)[number]

export type SignInBody = {
  username: string
  password: string
}

export type SignInResponse =
  | {
    ok: true
    message: AuthMessage
    token: string
  }
  | {
    ok: false
    message: AuthMessage
    token: null
  }

export type DeepType = {
  data: {
    items: {
      id: string
      details: {
        raw: unknown
        history: {
          date: Date
          action: string
        }[]
      }
    }[]
    meta: {
      total: number
    }
  }
}
