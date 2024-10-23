import kleur from 'kleur'
import logSymbols from 'log-symbols'
const { error, warning, info, success } = logSymbols

export const logger = {
  error(...args: unknown[]) {
    console.log(
      kleur.red([error, 'ERROR:'].join(' ')),
      kleur.red(args.join(' '))
    )
    return this
  },
  warn(...args: unknown[]) {
    console.log(
      kleur.yellow([warning, 'WARN:'].join(' ')),
      kleur.yellow(args.join(' '))
    )
    return this
  },
  info(...args: unknown[]) {
    console.log(
      kleur.green([info, 'INFO:'].join(' ')),
      kleur.green(args.join(' '))
    )
    return this
  },
  success(...args: unknown[]) {
    console.log(
      kleur.green([success, 'SUCCESS:'].join(' ')),
      kleur.green(args.join(' '))
    )
    return this
  },
  break() {
    console.log('')
    return this
  }
}
