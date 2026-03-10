import kleur from 'kleur'

// biome-ignore lint/complexity/noStaticOnlyClass: Logger uses static-only pattern for structured logging utility.
export class Logger {
  private static logLevels = new Map([
    ['success', { color: kleur.green, icon: '[ok]', method: console.log }],
    ['warn', { color: kleur.yellow, icon: '!', method: console.warn }],
    ['error', { color: kleur.red, icon: '[x]', method: console.error }],
    ['fatal', { color: kleur.bgRed().white, icon: '[!!]', method: console.error }],
  ])

  private static log(level: 'success' | 'warn' | 'error' | 'fatal', message: string) {
    const caller = new Error().stack?.split('\n')[3]?.trim().split(' ')[1] || 'Unknown Function'
    const timestamp = kleur.gray(`[${new Date().toISOString()}]`)
    const cwd = kleur.cyan(process.cwd())
    const logStyle = Logger.logLevels.get(level)

    if (logStyle) {
      const formattedMessage = `${timestamp} ${logStyle.icon} ${logStyle.color(`[${level.toUpperCase()}]`)} ${kleur.bold(message)}`
      logStyle.method(`${formattedMessage}\n ${kleur.dim(`> ${caller}`)}  |  ${kleur.underline(cwd)}`)
    }
  }

  static success<T>(message: string, data: T): { success: true; message: string; data: T } {
    Logger.log('success', message)
    return { data, message, success: true }
  }

  static warn(message: string) {
    Logger.log('warn', message)
  }

  static error(message: string): {
    success: false
    message: string
    data: null
  } {
    Logger.log('error', message)
    return { data: null, message, success: false }
  }

  static throwFatalError(message: string): never {
    Logger.log('fatal', message)
    throw new Error(message)
  }
}

