export interface LoggerParams {
  with_icon?: boolean
  args: unknown[]
}

export type LoggerType = {
  error: ({ with_icon, args }: LoggerParams) => any
  warn: ({ with_icon, args }: LoggerParams) => any
  info: ({ with_icon, args }: LoggerParams) => any
  success: ({ with_icon, args }: LoggerParams) => any
  break: () => any
}
