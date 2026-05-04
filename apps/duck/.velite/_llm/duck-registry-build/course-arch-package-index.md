}>

This walkthrough uses the same shape as the in-repo example under `packages/registry-build/examples/arch-package-index`, but explains each decision so you can adapt it to your own package ecosystem.

## Goal

We want to build something that looks more like an Arch package repository than a UI component registry.

Inputs:

- package records in JSON
- a `pkgbuilds/` source tree
- static repo ordering metadata

Outputs:

- `dist/arch/repos/core.db.json`
- `dist/arch/repos/extra.db.json`
- `dist/arch/repos/core.files.txt`
- `dist/arch/repos/extra.files.txt`
- `dist/arch/search.json`

The important design point is that we do **not** model this as a UI registry. We use `collections` plus one custom extension.

---

## Step 1: Define the project shape

Use a layout like this:

```text
my-packages/
  data/
    packages.json
  pkgbuilds/
    core/
      bash/
        PKGBUILD
    extra/
      git/
        PKGBUILD
      fzf/
        PKGBUILD
  registry-build.config.ts
  arch-repository.extension.ts
```

Keep the config at the root of the package that owns the outputs.

---

## Step 2: Create the package data

`collections` work best when the extension input is already explicit and versioned. Start with a JSON dataset:

```json
[
  {
    "name": "bash",
    "repo": "core",
    "version": "5.2.037-1",
    "arch": "x86_64",
    "description": "The GNU Bourne Again shell",
    "depends": ["glibc"],
    "provides": ["sh"],
    "licenses": ["GPL"],
    "files": ["/usr/bin/bash", "/usr/share/man/man1/bash.1.gz"]
  }
]
```

Use the JSON file as the source of truth for the extension. The `pkgbuilds/` tree is still useful as an adjacent source tree for validation, lookups, or future extension logic.

---

## Step 3: Declare a generic config

```ts

export default defineConfig({
  collections: {
    packages: {
      data: './data/packages.json',
      metadata: {
        repoOrder: ['core', 'extra'],
      },
      sources: {
        pkgbuilds: {
          glob: '**/PKGBUILD',
          path: './pkgbuilds',
          referencePath: '/pkgbuilds',
        },
      },
    },
  },
  extensions: [
    archRepositoryExtension({
      collection: 'packages',
    }),
  ],
  output: {
    dir: './dist',
  },
})
```

Why this shape works:

- `collections.packages.data` is your package dataset
- `collections.packages.metadata` holds repo ordering
- `collections.packages.sources` gives the extension a named source tree
- The runner is entirely extension-driven  -  only the extensions you register will run

---

## Step 4: Write the extension

The extension reads the collection, groups package records by repo, emits files, and registers outputs.

```ts

export function archRepositoryExtension(options: { collection: string }) {
  return {
    name: 'archRepository',
    stage: 'afterBuild',
    async run(api) {
      const collections = api.getArtifact('collections') ?? api.config.collections
      const collection = collections[options.collection]
      const packages = collection.data as Array<{
        name: string
        repo: string
        version: string
        description: string
        arch: string
        depends?: string[]
        provides?: string[]
        files?: string[]
      }>

      const outputRoot = path.join(api.paths.baseDir, 'arch')
      const repoDir = path.join(outputRoot, 'repos')
      const repoOrder = Array.isArray(collection.metadata.repoOrder)
        ? (collection.metadata.repoOrder as string[])
        : [...new Set(packages.map((pkg) => pkg.repo))]

      const outputFiles: string[] = []
      const emittedFiles: string[] = []

      for (const repo of repoOrder) {
        const repoPackages = packages.filter((pkg) => pkg.repo === repo)
        const dbFile = path.join(repoDir, `${repo}.db.json`)
        const filesFile = path.join(repoDir, `${repo}.files.txt`)

        if (await writeJsonIfChanged(dbFile, { repo, packages: repoPackages })) {
          emittedFiles.push(dbFile)
        }

        if (
          await writeFileIfChanged(
            filesFile,
            repoPackages.map((pkg) => `${pkg.name} ${pkg.version}`).join('\n'),
          )
        ) {
          emittedFiles.push(filesFile)
        }

        outputFiles.push(dbFile, filesFile)
      }

      const searchFile = path.join(outputRoot, 'search.json')
      if (await writeJsonIfChanged(searchFile, packages)) {
        emittedFiles.push(searchFile)
      }
      outputFiles.push(searchFile)

      api.setArtifact('archRepository', {
        packageCount: packages.length,
        repos: repoOrder,
      })
      api.registerOutput('archRepository', outputFiles, {
        collection: options.collection,
        kind: 'arch-repository',
      })

      return {
        name: 'archRepository',
        itemCount: packages.length,
        outputFiles: emittedFiles,
      }
    },
  }
}
```

Important design choices:

- the extension reads `collections`, not UI registry entries
- `writeJsonIfChanged()` and `writeFileIfChanged()` prevent unnecessary rewrites
- `registerOutput()` keeps the build summary and downstream tooling aware of emitted files
- `setArtifact()` makes the derived repository model available to later extensions

---

## Step 5: Run the build

```bash
registry-build build
```

The summary should show your custom extension phase and list rewritten files only when output content actually changed.

For local iteration:

```bash
registry-build build --changed-only
```

Even if your extension owns all outputs, the cache still helps with repeated runs and file-hash reuse.

---

## Step 6: Verify the outputs

Check the generated files:

```text
dist/
  .registry-build/
  arch/
    repos/
      core.db.json
      core.files.txt
      extra.db.json
      extra.files.txt
    search.json
```

Sanity-check a few contracts:

- every package appears in exactly one repo database
- repo ordering matches `collection.metadata.repoOrder`
- `search.json` contains the fields your downstream consumer expects
- running the same build twice without changes rewrites zero files

---

## Step 7: Production hardening

Before calling the project ready, add:

1. schema validation for `packages.json`
2. tests for the extension output shape
3. a warm-build no-op check in CI
4. a changed-only smoke test for a small package update
5. docs for the data contract your package records must satisfy

For a stronger version, add an extra validation extension that compares `packages.json` against discovered `PKGBUILD` files.

---

## Where to take it next

You can extend the same pattern to emit:

- dependency graphs
- `provides` and `conflicts` lookup tables
- repo snapshots per architecture
- search shards for a web UI
- signed metadata for a publishing pipeline

The point of the course is not Arch specifically. It is to show that `registry-build` can be the engine underneath any structured index build when you keep the core generic and push domain behavior into extensions.

---

## Related pages

- [Configuration](/duck-registry-build/configuration)
- [Extensions](/duck-registry-build/extensions)
- [Performance](/duck-registry-build/performance)
- [Recipes](/duck-registry-build/recipes)