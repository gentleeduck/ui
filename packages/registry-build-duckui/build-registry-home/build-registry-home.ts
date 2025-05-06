import figlet from 'figlet'
import cliWidth from 'cli-width'
import { Ora } from 'ora'

/**
 * Generates and prints the Duck UI ASCII home screen.
 *
 * @returns {Promise<void>} Resolves when ASCII text is successfully printed.
 * @throws {Error} Logs an error if ASCII generation fails.
 */
export async function build_registry_home(spinner: Ora): Promise<void> {
  try {
    const asciiText = await generateAsciiArt('DUCK UI')
    console.log(asciiText)
  } catch (error) {
    spinner.fail(`Failed to generate ASCII UI: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(0)
  }
}

/**
 * Generates ASCII text using figlet.
 *
 * @async
 * @param {string} text - The text to convert into ASCII art.
 * @returns {Promise<string>} Resolves with the generated ASCII text.
 * @throws {Error} Rejects if figlet encounters an error.
 */
async function generateAsciiArt(text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    figlet.text(text, { width: cliWidth(), whitespaceBreak: true, font: 'ANSI Shadow' }, (err, data) =>
      err ? reject(new Error(`Error generating ASCII art: ${err.message}`)) : resolve(data || ''),
    )
  })
}
