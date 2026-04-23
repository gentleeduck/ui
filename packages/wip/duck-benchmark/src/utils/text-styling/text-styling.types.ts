export interface ILoggerParams {
  withIcon?: boolean
  args: unknown[]
}

export type LoggerType = {
  error: ({ withIcon, args }: ILoggerParams) => any
  warn: ({ withIcon, args }: ILoggerParams) => any
  info: ({ withIcon, args }: ILoggerParams) => any
  success: ({ withIcon, args }: ILoggerParams) => any
  break: () => any
}
