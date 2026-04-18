export interface ILoggerParams {
  withIcon?: boolean
  args: unknown[]
}

export type LoggerType = {
  error: ({ withIcon, args }: ILoggerParams) => LoggerType
  warn: ({ withIcon, args }: ILoggerParams) => LoggerType
  info: ({ withIcon, args }: ILoggerParams) => LoggerType
  success: ({ withIcon, args }: ILoggerParams) => LoggerType
  break: () => LoggerType
}
