import { createMatchPath, type ConfigLoaderSuccessResult } from 'tsconfig-paths'

export async function resolve_import(
  importPath: string,
  config: Pick<ConfigLoaderSuccessResult, 'absoluteBaseUrl' | 'paths'>
) {
  return createMatchPath(config.absoluteBaseUrl, config.paths)(importPath, undefined, () => true, ['.ts', '.tsx'])
}
