import kleur from 'kleur'
import logSymbols from 'log-symbols'
import type { ILoggerParams, LoggerType } from './text-styling.types'

const { error, warning, info, success } = logSymbols

export const logger: LoggerType = {
  break: (): LoggerType => {
    console.log('')
    return logger
  },
  error: ({ withIcon = true, args }: ILoggerParams): LoggerType => {
    console.log(kleur.red([withIcon ? error : '', 'ERROR:'].join(' ')), kleur.red(args.join(' ')))
    return logger
  },

  info: ({ withIcon = true, args }: ILoggerParams): LoggerType => {
    console.log(kleur.green([withIcon ? info : '', 'INFO:'].join(' ')), kleur.green(args.join(' ')))
    return logger
  },

  success: ({ args, withIcon }: ILoggerParams): LoggerType => {
    console.log(kleur.green([withIcon ? success : '', 'SUCCESS:'].join(' ')), kleur.green(args.join(' ')))
    return logger
  },

  warn: ({ withIcon = true, args }: ILoggerParams): LoggerType => {
    console.log(kleur.yellow([withIcon ? warning : '', 'WARN:'].join(' ')), kleur.yellow(args.join(' ')))
    return logger
  },
}
