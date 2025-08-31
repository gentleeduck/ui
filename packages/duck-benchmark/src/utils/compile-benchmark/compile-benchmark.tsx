import { highlighter } from '../text-styling'
import { compile_file, render_file } from './compile-benchmark.libs'
import { CompileBenchmarkParams, RenderBenchmarkParams } from './compile-benchmark.types'

export async function compile_benchmark({
  folders,
  visited = new Set<string>(),
  spinner,
  cwd,
}: CompileBenchmarkParams) {
  try {
    spinner.text = `Compiling ${folders.length} folders`

    for (const folder of folders) {
      if (visited.has(folder.path)) continue // Prevent infinite loops

      // Process files in the current folder
      for (const file of folder.files) {
        const res = await compile_file({ file, spinner, cwd })
        file.compile_time_ms = res.compile_time_ms
        file.bundle_size = res.bundle_size
      }

      // Recursively process subdirectories
      if (folder.subdirectories.length > 0) {
        await compile_benchmark({
          folders: folder.subdirectories,
          visited,
          spinner,
          cwd,
        })
      }
    }

    spinner.text = highlighter.success(`Compiled ${folders.length} folders`)
  } catch (error) {
    spinner.fail(`Compilation failed: ${error}`)
  }
}

export async function render_benchmark({ folders, visited = new Set<string>(), spinner, cwd }: RenderBenchmarkParams) {
  try {
    // spinner.text = `Rendering ${folders.length} folders`

    for (const folder of folders) {
      if (visited.has(folder.path)) continue // Prevent infinite loops

      // Process files in the current folder
      for (const file of folder.files) {
        const res = await render_file({ file, spinner, cwd })
        file.render_time_ms = res.renderTimeMs
      }

      // Recursively process subdirectories
      if (folder.subdirectories.length > 0) {
        await render_benchmark({
          folders: folder.subdirectories,
          visited,
          spinner,
          cwd,
        })
      }
    }
  } catch (error) {
    spinner.fail(`Rendering failed: ${error}`)
    process.exit(1)
  }
}
