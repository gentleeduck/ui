import path from 'node:path'
import { Project } from 'ts-morph'

type CachedProject = {
  project: Project
  globs: Set<string>
}

const PROJECT_CACHE = new Map<string, CachedProject>()

function resolveGlob(baseDir: string, glob: string): string {
  return path.isAbsolute(glob) ? glob : path.resolve(baseDir, glob)
}

export function getProject(tsconfigPath: string, sourceGlobs: string[] = []): Project {
  const key = path.resolve(tsconfigPath)
  let cached = PROJECT_CACHE.get(key)

  if (!cached) {
    cached = {
      globs: new Set<string>(),
      project: new Project({ skipAddingFilesFromTsConfig: true, tsConfigFilePath: key }),
    }
    PROJECT_CACHE.set(key, cached)
  }

  const baseDir = path.dirname(key)
  const globs = sourceGlobs.length ? sourceGlobs : ['**/*.{ts,tsx}']

  for (const g of globs) {
    const resolved = resolveGlob(baseDir, g)
    if (cached.globs.has(resolved)) continue
    cached.project.addSourceFilesAtPaths(resolved)
    cached.globs.add(resolved)
  }

  return cached.project
}
