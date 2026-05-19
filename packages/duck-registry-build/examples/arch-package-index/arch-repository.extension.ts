import path from 'node:path'
import type { IRegistryBuildExtension } from '../../src'
import { writeFileIfChanged, writeJsonIfChanged } from '../../src'
import type { IResolvedRegistryBuildCollection } from '../../src/config/types'

interface ArchPackageRecord {
  arch: string
  conflicts?: string[]
  depends?: string[]
  description: string
  files?: string[]
  licenses?: string[]
  name: string
  provides?: string[]
  repo: string
  version: string
}

interface ArchRepositoryExtensionOptions {
  collection: string
  outputDir?: string
}

function byName(left: ArchPackageRecord, right: ArchPackageRecord) {
  return left.name.localeCompare(right.name)
}

function toPackageArray(value: unknown): ArchPackageRecord[] {
  if (!Array.isArray(value)) {
    throw new Error('Arch repository example expects collection.data to be an array of package records.')
  }

  return value as ArchPackageRecord[]
}

export function archRepositoryExtension(options: ArchRepositoryExtensionOptions): IRegistryBuildExtension {
  return {
    name: 'archRepository',
    stage: 'afterBuild',
    async run(api) {
      const collections =
        api.getArtifact<Record<string, IResolvedRegistryBuildCollection>>('collections') ?? api.config.collections
      const collection = collections[options.collection]

      if (!collection) {
        throw new Error(`Collection "${options.collection}" was not found.`)
      }

      const packages = toPackageArray(collection.data).slice().sort(byName)
      const outputRoot = path.join(api.paths.baseDir, options.outputDir ?? 'arch')
      const repoDir = path.join(outputRoot, 'repos')
      const repoOrder = Array.isArray(collection.metadata['repoOrder'])
        ? (collection.metadata['repoOrder'] as string[])
        : [...new Set(packages.map((pkg) => pkg.repo))].sort((left, right) => left.localeCompare(right))
      const search = packages.map((pkg) => ({
        arch: pkg.arch,
        depends: pkg.depends ?? [],
        description: pkg.description,
        name: pkg.name,
        provides: pkg.provides ?? [],
        repo: pkg.repo,
        version: pkg.version,
      }))
      const outputFiles: string[] = []
      const emittedFiles: string[] = []

      for (const repo of repoOrder) {
        const repoPackages = packages.filter((pkg) => pkg.repo === repo).sort(byName)
        const dbFile = path.join(repoDir, `${repo}.db.json`)
        const filesFile = path.join(repoDir, `${repo}.files.txt`)
        const fileManifest = repoPackages
          .flatMap((pkg) => [`${pkg.name} ${pkg.version}`, ...(pkg.files ?? []).map((filePath) => `  ${filePath}`), ''])
          .join('\n')
          .trimEnd()
        const dbPayload = {
          generatedAt: 'static-example',
          packageCount: repoPackages.length,
          packages: repoPackages.map((pkg) => ({
            arch: pkg.arch,
            conflicts: pkg.conflicts ?? [],
            depends: pkg.depends ?? [],
            description: pkg.description,
            licenses: pkg.licenses ?? [],
            name: pkg.name,
            provides: pkg.provides ?? [],
            version: pkg.version,
          })),
          repo,
        }

        if (await writeJsonIfChanged(dbFile, dbPayload)) {
          emittedFiles.push(dbFile)
        }

        if (await writeFileIfChanged(filesFile, fileManifest)) {
          emittedFiles.push(filesFile)
        }

        outputFiles.push(dbFile, filesFile)
      }

      const searchFile = path.join(outputRoot, 'search.json')
      if (await writeJsonIfChanged(searchFile, search)) {
        emittedFiles.push(searchFile)
      }
      outputFiles.push(searchFile)

      api.setArtifact('archRepository', {
        packageCount: packages.length,
        repos: repoOrder,
        search,
      })
      api.registerOutput('archRepository', outputFiles, {
        collection: options.collection,
        kind: 'arch-repository',
      })

      return {
        details: `${repoOrder.length} repos`,
        itemCount: packages.length,
        name: 'archRepository',
        outputFiles: emittedFiles,
      }
    },
  }
}
