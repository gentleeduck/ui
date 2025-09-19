import cliWidth from 'cli-width'
import figlet from 'figlet'
import { Ora } from 'ora'

/**
 * Generates and prints the Duck UI ASCII home screen.
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
 */
async function generateAsciiArt(text: string): Promise<string> {
  return new Promise((resolve, reject) => {
    figlet.text(text, { font: 'ANSI Shadow', whitespaceBreak: true, width: cliWidth() }, (err, data) =>
      err ? reject(new Error(`Error generating ASCII art: ${err.message}`)) : resolve(data || ''),
    )
  })
}
