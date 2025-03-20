import { compileFile } from './compile-benchmark.libs'
import { CompileBenchmarkParams } from './compile-benchmark.types'

export async function compileBenchmark({
  folders,
  visited = new Set<string>(),
}: CompileBenchmarkParams) {
  for (const folder of folders) {
    if (visited.has(folder.path)) continue // Prevent infinite loops

    // Process files in the current folder
    for (const file of folder.files) {
      file.compile_info = await compileFile(file)
    }

    // Recursively process subdirectories
    if (folder.subdirectories.length > 0) {
      await compileBenchmark({ folders: folder.subdirectories, visited })
    }
  }
}
