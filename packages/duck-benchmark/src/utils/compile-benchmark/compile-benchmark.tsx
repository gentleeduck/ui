import { highlighter } from '../text-styling'
import { compileFile, renderFile } from './compile-benchmark.libs'
import type { CompileBenchmarkParams, RenderBenchmarkParams } from './compile-benchmark.types'

export async function compileBenchmark({
  folders,
  visited = new Set<string>(),
  spinner,
  cwd,
}: CompileBenchmarkParams) {
  try {
    spinner.text = `Compiling ${folders.length} folders`

    for (const folder of folders) {
      if (visited.has(folder.path)) continue // Prevent infinite loops
      visited.add(folder.path)

      // Process files in the current folder
      for (const file of folder.files) {
        const res = await compileFile({ cwd, file, spinner })
        file.compileTimeMs = res.compileTimeMs
        file.bundleSize = res.bundleSize
      }

      // Recursively process subdirectories
      if (folder.subdirectories.length > 0) {
        await compileBenchmark({
          cwd,
          folders: folder.subdirectories,
          spinner,
          visited,
        })
      }
    }

    spinner.text = highlighter.success(`Compiled ${folders.length} folders`)
  } catch (error) {
    spinner.fail(`Compilation failed: ${error}`)
  }
}

export async function renderBenchmark({ folders, visited = new Set<string>(), spinner, cwd }: RenderBenchmarkParams) {
  try {
    // spinner.text = `Rendering ${folders.length} folders`

    for (const folder of folders) {
      if (visited.has(folder.path)) continue // Prevent infinite loops
      visited.add(folder.path)

      // Process files in the current folder
      for (const file of folder.files) {
        const res = await renderFile({ cwd, file, spinner })
        file.renderTimeMs = res.renderTimeMs
      }

      // Recursively process subdirectories
      if (folder.subdirectories.length > 0) {
        await renderBenchmark({
          cwd,
          folders: folder.subdirectories,
          spinner,
          visited,
        })
      }
    }
  } catch (error) {
    spinner.fail(`Rendering failed: ${error}`)
    process.exit(1)
  }
}
