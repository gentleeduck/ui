// scripts/generate-types.ts
import fs from 'fs'
import path from 'path'
import { routerRegistry } from './index.ctx'

const typesFile = path.resolve(__dirname, '../index.d.ts')

let output = `// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.\n\n`
output += `import { signin_controller } from './index-server';\n\n`
output += `export interface ApiRoutes {\n`

for (const [route, handler] of Object.entries(routerRegistry.get)) {
  const fn = handler as Function

  const paramType = fn.length > 0 ? `Parameters<typeof ${fn.name}>[0]` : 'void'
  const returnType = `ReturnType<typeof ${fn.name}>`

  output += `  '${route}': { req: ${paramType}; res: ${returnType} };\n`
}

output += `}\n`

fs.writeFileSync(typesFile, output)
console.log('index.d.ts generated!')
