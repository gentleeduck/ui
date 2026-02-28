export interface LoggerParams {
  with_icon?: boolean
  args: unknown[]
}

export type LoggerType = {
  error: ({ with_icon, args }: LoggerParams) => LoggerType
  warn: ({ with_icon, args }: LoggerParams) => LoggerType
  info: ({ with_icon, args }: LoggerParams) => LoggerType
  success: ({ with_icon, args }: LoggerParams) => LoggerType
  break: () => LoggerType
}
