import figlet from 'figlet'
import cliWidth from 'cli-width'

export async function build_registry_home() {
  // Get current terminal width
  const width = cliWidth()

  // Wrap figlet.text in a Promise to make it awaitable
  await new Promise<string>((resolve, reject) => {
    figlet.text(' DUCK UI', { width: width, whitespaceBreak: true, font: 'ANSI Shadow' }, (err, data) => {
      if (err) {
        reject('Error generating ASCII art: ' + err)
      } else {
        console.log(data || '')
        resolve(data || '')
      }
    })
  })
}
