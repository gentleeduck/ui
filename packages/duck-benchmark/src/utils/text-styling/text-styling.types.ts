export interface ILoggerParams {
  with_icon?: boolean
  args: unknown[]
}

export type LoggerType = {
  error: ({ with_icon, args }: ILoggerParams) => any
  warn: ({ with_icon, args }: ILoggerParams) => any
  info: ({ with_icon, args }: ILoggerParams) => any
  success: ({ with_icon, args }: ILoggerParams) => any
  break: () => any
}
