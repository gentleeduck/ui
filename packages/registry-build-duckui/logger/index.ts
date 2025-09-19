import kleur from 'kleur'

/**
 * Utility class for structured execution results and logging.
 * Provides methods for logging success, warnings, errors, and fatal exceptions.
 */

export class Logger {
  /**
   * Log levels mapped to console methods for efficient logging.
   */
  private static logLevels = new Map([
    ['success', { color: kleur.green, icon: '✅', method: console.log }],
    ['warn', { color: kleur.yellow, icon: '!', method: console.warn }],
    ['error', { color: kleur.red, icon: '❌', method: console.error }],
    ['fatal', { color: kleur.bgRed().white, icon: '🔥', method: console.error }],
  ])

  /**
   * Logs structured messages with timestamp, context, and styling.
   * @param {'success' | 'warn' | 'error' | 'fatal'} level - The log level.
   * @param {string} message - The message to log.
   */
  private static log(level: 'success' | 'warn' | 'error' | 'fatal', message: string) {
    const caller = new Error().stack?.split('\n')[3]?.trim().split(' ')[1] || 'Unknown Function'
    const timestamp = kleur.gray(`[${new Date().toISOString()}]`)
    const cwd = kleur.cyan(process.cwd())
    const logStyle = this.logLevels.get(level)

    if (logStyle) {
      const formattedMessage = `${timestamp} ${logStyle.icon} ${logStyle.color(`[${level.toUpperCase()}]`)} ${kleur.bold(message)}`
      logStyle.method(`${formattedMessage}\n ${kleur.dim(`📌 ${caller}`)}  |  ${kleur.underline(cwd)}`)
    }
  }

  /**
   * Handles successful execution and logs the success message.
   * @template T - The type of the data being returned.
   * @param {string} message - A success message.
   * @param {T} data - The data associated with the success response.
   * @returns {{ success: true; message: string; data: T }}
   */
  static success<T>(message: string, data: T): { success: true; message: string; data: T } {
    this.log('success', message)
    return { data, message, success: true }
  }

  /**
   * Logs a warning with structured output.
   * @param {string} message - A warning message.
   */
  static warn(message: string) {
    this.log('warn', message)
  }

  /**
   * Handles an error case without throwing an exception.
   * Logs the error message and returns a structured failure response.
   * @param {string} message - An error message.
   * @returns {{ success: false; message: string; data: null }}
   */
  static error(message: string): {
    success: false
    message: string
    data: null
  } {
    this.log('error', message)
    return { data: null, message, success: false }
  }

  /**
   * Throws a fatal error and halts execution. Use for unrecoverable errors.
   * Logs the fatal error message before throwing.
   * @param {string} message - A fatal error message.
   * @throws {Error} Always throws an Error with the provided message.
   */
  static throwFatalError(message: string): never {
    this.log('fatal', message)
    throw new Error(message)
  }
}
