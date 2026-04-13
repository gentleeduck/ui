import kleur from 'kleur'
import pkg from '../../package.json'

export function printBanner() {
  const text = `\n 🦆 duck-cli ${pkg.version}`
  const line = '\u2500'.repeat(text.length)
  console.log(kleur.white(text))
  console.log(kleur.bold().green(line))
}
