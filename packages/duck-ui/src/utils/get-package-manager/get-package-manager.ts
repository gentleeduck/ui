import { type Agent, detect } from '@antfu/ni'

export async function get_package_manager(cwd: string): Promise<Exclude<Agent, 'yarn@berry' | 'pnpm@6'>> {
  const packageManager = await detect({
    cwd,
    programmatic: true,
  })

  if (packageManager === 'yarn@berry') return 'yarn'
  if (packageManager === 'pnpm@6') return 'pnpm'
  if (!packageManager) return 'npm'

  return packageManager
}

export async function getPackageRunner(
  cwd: string,
  pm: Exclude<Agent, 'yarn@berry' | 'pnpm@6'>,
): Promise<'pnpm dlx' | 'bunx' | 'npx'> {
  const packageManager = pm ?? (await get_package_manager(cwd))

  if (packageManager === 'pnpm') return 'pnpm dlx'
  if (packageManager === 'bun') return 'bunx'
  return 'npx'
}
