import path, { resolve } from 'node:path'
import fs from 'fs-extra'
import { init_options_schema, InitOptions } from './init.dto'
import { get_project_config } from '@/src/utils'
import { list_files } from '@/src/utils/list-files'
import { execa } from 'execa'
import { FileInfo, FolderInfo } from '@/src/utils/list-files/list-files.dto'

export async function init_command_action(opt: InitOptions) {
  const options = init_options_schema.parse(opt)
  const cwd = path.resolve(options.cwd)

  //NOTE: we added this prefix to the path hence we have this in the test project.
  const config = await get_project_config(cwd + '/test/')
  if (!config) return

  const entries_json = await list_files({
    cwds: [config.src],
    filter: ['', 'vite-env.d.ts', 'main.tsx'],
  })
  const rs = await compileAndBenchmark(entries_json)
  console.dir(entries_json, { depth: 11 })

  //TODO: make sure to compile each file in these folders.
  //TODO: get compile result and statics regarding each file in the folder.
  // logger.info({ args: ['Done.!'] })
}

async function compileAndBenchmark(
  folders: FolderInfo[],
  visited = new Set<string>(),
) {
  for (const folder of folders) {
    if (visited.has(folder.path)) continue // Prevent infinite loops
    visited.add(folder.path)

    console.log(`Processing folder: ${folder.path}`)

    // Process files in the current folder
    for (const file of folder.files) {
      console.log(`Compiling file: ${file.path}`)
      file.compile_info = await compileFile(file)
    }

    // Recursively process subdirectories
    if (folder.subdirectories.length > 0) {
      await compileAndBenchmark(folder.subdirectories, visited)
    }
  }
}
import { performance } from 'node:perf_hooks'

async function compileFile(fileInfo: FileInfo) {
  const outDir = path.join('dist', fileInfo.name.replace(/\.(ts|tsx)$/, '.js'))
  const start = performance.now()

  try {
    const projectDir = process.cwd()
    const tempConfigPath = resolve(projectDir, `vite.temp.config.ts`)

    // Generate a temporary Vite config file
    const viteConfigContent = `
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig({
  build: {
    sourcemap: false,
    outDir: 'dist/${fileInfo.name}',
    lib: {
      entry: path.resolve(__dirname, '${fileInfo.path}'), 
      name: 'App',
      fileName: () => '${fileInfo.name.replace(/\.(ts|tsx)$/, '.js')}', // Output as App.js (JSX isn't valid output)
      formats: ['es'], // ESM format
    },
  },
  plugins: [react()],
})
    `

    fs.writeFileSync(tempConfigPath, viteConfigContent)

    await execa(
      'vite',
      ['build', '--config', path.resolve(projectDir, 'vite.temp.config.ts')],
      {
        stdio: 'ignore',
        cwd: projectDir,
      },
    )

    // Remove the temporary config after build
    fs.unlinkSync(tempConfigPath)

    const compileTimeMs = performance.now() - start
    const bundleSize = fs.existsSync(outDir) ? fs.statSync(outDir).size : 0

    return {
      compileTimeMs,
      bundleSize,
    }
  } catch (error) {
    return {
      compileTimeMs: performance.now() - start,
      bundleSize: 0,
      errors: [error || error],
    }
  }
}
