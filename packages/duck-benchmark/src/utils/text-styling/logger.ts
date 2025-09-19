import kleur from 'kleur'
import logSymbols from 'log-symbols'
import { LoggerParams, LoggerType } from './text-styling.types'

const { error, warning, info, success } = logSymbols

// Define the logger object with proper types
export const logger: LoggerType = {
  break: (): LoggerType => {
    console.log('')
    return logger
  },
  error: ({ with_icon = true, args }: LoggerParams): LoggerType => {
    console.log(kleur.red([with_icon ? error : '', 'ERROR:'].join(' ')), kleur.red(args.join(' ')))
    return logger
  },

  info: ({ with_icon = true, args }: LoggerParams): LoggerType => {
    console.log(kleur.green([with_icon ? info : '', 'INFO:'].join(' ')), kleur.green(args.join(' ')))
    return logger
  },

  success: ({ args, with_icon }: LoggerParams): LoggerType => {
    console.log(kleur.green([with_icon ? success : '', 'SUCCESS:'].join(' ')), kleur.green(args.join(' ')))
    return logger
  },

  warn: ({ with_icon = true, args }: LoggerParams): LoggerType => {
    console.log(kleur.yellow([with_icon ? warning : '', 'WARN:'].join(' ')), kleur.yellow(args.join(' ')))
    return logger
  },
}
