import { type AGENTS, detect } from '@antfu/ni'

export async function getPackageManager(
  cwd: string,
): Promise<Exclude<(typeof AGENTS)[number], 'yarn@berry' | 'pnpm@6'>> {
  const packageManager = await detect({
    cwd,
    programmatic: true,
  })

  if (packageManager === 'yarn@berry') return 'yarn'
  if (packageManager === 'pnpm@6') return 'pnpm'
  if (!packageManager) return 'npm'

  return packageManager
}
