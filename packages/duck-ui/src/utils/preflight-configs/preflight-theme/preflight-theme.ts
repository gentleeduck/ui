export async function preflight_theme(_options: InitOptions, spinner: Ora) {
  try {
    spinner.text = `${highlighter.info('Preflighting required theme...')}`
  } catch (error) {
    spinner.fail(`Failed to preflight required theme...\n ${highlighter.error(error as string)}`)
    process.exit(0)
  }
}
