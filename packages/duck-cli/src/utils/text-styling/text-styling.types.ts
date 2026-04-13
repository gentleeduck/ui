export interface LoggerParams {
  withIcon?: boolean
  args: unknown[]
}

export type LoggerType = {
  error: ({ withIcon, args }: LoggerParams) => LoggerType
  warn: ({ withIcon, args }: LoggerParams) => LoggerType
  info: ({ withIcon, args }: LoggerParams) => LoggerType
  success: ({ withIcon, args }: LoggerParams) => LoggerType
  break: () => LoggerType
}
