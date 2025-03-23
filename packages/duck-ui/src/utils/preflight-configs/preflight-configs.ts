import { Ora } from 'ora'
import { highlighter } from '../text-styling'
import { preflight_duckui } from './preflight-duckui'
import { preflight_tailwindcss } from './preflight-tailwindcss'
import { preflight_typescript } from './preflight-typescript'

export type PrefLightTypescriptOptions = {
  cwd: string
  spinner: Ora
}

export async function preflight_configs({
  cwd,
  spinner,
}: PrefLightTypescriptOptions): Promise<void> {
  try {
    spinner.text = `${highlighter.info('Preflighting required configs...')}`
    await preflight_typescript(cwd, spinner)
    await preflight_tailwindcss(cwd, spinner)
    await preflight_duckui(cwd, spinner)

    spinner.text = `${highlighter.info('Configs preflighted...')}`
  } catch (error) {
    spinner.fail(
      `Failed to preflight required configs...\n ${highlighter.error(
        error as string,
      )}`,
    )
    process.exit(0)
  }
}
