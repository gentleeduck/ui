// import { spawnSync } from 'node:child_process'
// import fs from 'node:fs'
// import path from 'node:path'
//
// function run(command, args, options = {}) {
//   const result = spawnSync(command, args, {
//     stdio: 'inherit',
//     ...options,
//   })
//
//   if (result.error) throw result.error
//   return result.status ?? 1
// }
//
// function runCapture(command, args, options = {}) {
//   const result = spawnSync(command, args, {
//     encoding: 'utf8',
//     ...options,
//   })
//   if (result.error) throw result.error
//   return {
//     status: result.status ?? 1,
//     stdout: result.stdout ?? '',
//     stderr: result.stderr ?? '',
//   }
// }
//
// function loadWorkspacePackages() {
//   const { status, stdout, stderr } = runCapture('pnpm', ['-r', 'list', '--depth', '-1', '--json'])
//   if (status !== 0) {
//     process.stderr.write(stderr)
//     throw new Error('Failed to enumerate workspace packages via pnpm')
//   }
//
//   const parsed = JSON.parse(stdout)
//   if (!Array.isArray(parsed)) return []
//
//   const packages = []
//   for (const entry of parsed) {
//     if (!entry || typeof entry !== 'object') continue
//     if (typeof entry.path !== 'string') continue
//     packages.push({
//       name: typeof entry.name === 'string' ? entry.name : entry.path,
//       dir: entry.path,
//     })
//   }
//
//   packages.sort((a, b) => a.name.localeCompare(b.name))
//   return packages
// }
//
// function hasTsconfig(dir) {
//   return fs.existsSync(path.join(dir, 'tsconfig.json'))
// }
//
// function main() {
//   const packages = loadWorkspacePackages()
//   if (packages.length === 0) {
//     console.log('[check-types] No workspace packages found')
//     return 0
//   }
//
//   let checked = 0
//   for (const pkg of packages) {
//     if (!hasTsconfig(pkg.dir)) continue
//
//     checked++
//     console.log(`[check-types] ${pkg.name}`)
//     const status = run('pnpm', [
//       '-C',
//       pkg.dir,
//       'exec',
//       tsc,
//       -p tsconfig.json --noEmit --pretty false      --skipLibCheck     ])
//     if (status !== 0) return status
//   }
//
//   console.log(`[check-types] OK (${checked} packages checked)`)
//   return 0
// }
//
// process.exitCode = main()
