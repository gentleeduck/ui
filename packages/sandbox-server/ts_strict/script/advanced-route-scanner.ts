import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface RouteDefinition {
  route: string
  method: string
  handler: string
  file: string
}

interface ControllerFunction {
  name: string
  parameters: ParameterInfo[]
  returnType: string
  isAsync: boolean
}

interface ParameterInfo {
  name: string
  type: string
  required: boolean
}

interface ControllerInfo {
  name: string
  file: string
  functions: ControllerFunction[]
}

interface MessageConstants {
  name: string
  type: string
  file: string
  values: string[]
}

class AdvancedRouteScanner {
  private routes: RouteDefinition[] = []
  private controllers: ControllerInfo[] = []
  private messageConstants: MessageConstants[] = []
  private baseDir: string
  private typesFile: string

  constructor() {
    this.baseDir = path.resolve(__dirname, '..')
    this.typesFile = path.resolve(this.baseDir, 'index.d.ts')
  }

  private findFiles(pattern: string): string[] {
    const files: string[] = []
    const searchDir = (dir: string, relativePath: string = '') => {
      const items = fs.readdirSync(dir)

      for (const item of items) {
        const fullPath = path.join(dir, item)
        const relativeItemPath = path.join(relativePath, item)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory()) {
          searchDir(fullPath, relativeItemPath)
        } else if (stat.isFile()) {
          // Simple pattern matching for .router.ts, .controller.ts, and .constants.ts files
          if (pattern.includes('*.router.ts') && item.endsWith('.router.ts')) {
            files.push(relativeItemPath)
          } else if (pattern.includes('*.controller.ts') && item.endsWith('.controller.ts')) {
            files.push(relativeItemPath)
          } else if (pattern.includes('*.constants.ts') && item.endsWith('.constants.ts')) {
            files.push(relativeItemPath)
          }
        }
      }
    }

    searchDir(this.baseDir)
    return files
  }

  async scanCodebase(): Promise<void> {
    console.log('Advanced route scanning started...')

    // Find all router files
    const routerFiles = this.findFiles('**/*.router.ts')
    console.log(`Found ${routerFiles.length} router files`)

    // Find all controller files
    const controllerFiles = this.findFiles('**/*.controller.ts')
    console.log(`Found ${controllerFiles.length} controller files`)

    // Find all constants files
    const constantsFiles = this.findFiles('**/*.constants.ts')
    console.log(`Found ${constantsFiles.length} constants files`)

    // Scan controller files first to build function registry
    for (const controllerFile of controllerFiles) {
      await this.scanControllerFile(controllerFile)
    }

    // Scan constants files for message constants
    for (const constantsFile of constantsFiles) {
      await this.scanConstantsFile(constantsFile)
    }

    // Scan router files for routes
    for (const routerFile of routerFiles) {
      await this.scanRouterFile(routerFile)
    }

    console.log(
      `Found ${this.routes.length} routes, ${this.controllers.length} controllers, and ${this.messageConstants.length} message constants`,
    )
  }

  private async scanControllerFile(controllerFile: string): Promise<void> {
    const fullPath = path.resolve(this.baseDir, controllerFile)
    const content = fs.readFileSync(fullPath, 'utf-8')

    const functions: ControllerFunction[] = []

    // Enhanced regex to capture async functions and better parameter parsing
    const functionRegex = /export\s+(async\s+)?function\s+(\w+)\s*\(([^)]*)\)\s*(?::\s*([^{]+))?/g
    let match: RegExpExecArray | [any, any, any, any, any] | null

    while ((match = functionRegex.exec(content)) !== null) {
      const [, asyncKeyword, name, params, returnType] = match
      const isAsync = !!asyncKeyword

      const parameters = this.parseParameters(params)

      functions.push({
        isAsync,
        name,
        parameters,
        returnType: returnType?.trim() || 'any',
      })
    }

    if (functions.length > 0) {
      this.controllers.push({
        file: controllerFile,
        functions,
        name: path.basename(controllerFile, '.controller.ts'),
      })
    }
  }

  private parseParameters(paramString: string): ParameterInfo[] {
    if (!paramString.trim()) return []

    return paramString.split(',').map((param) => {
      const trimmed = param.trim()

      // Handle destructured parameters like { data: SigninSchema }
      if (trimmed.startsWith('{') && trimmed.includes(':')) {
        const match = trimmed.match(/\{\s*(\w+)\s*:\s*(\w+)\s*\}/)
        if (match) {
          return {
            name: match[1],
            required: true,
            type: match[2],
          }
        }
      }

      // Handle regular parameters
      const [name, type] = trimmed.split(':').map((s) => s.trim())

      return {
        name: name || 'unknown',
        required: !name?.includes('?'),
        type: type || 'any',
      }
    })
  }

  private async scanRouterFile(routerFile: string): Promise<void> {
    const fullPath = path.resolve(this.baseDir, routerFile)
    const content = fs.readFileSync(fullPath, 'utf-8')

    // Enhanced regex to capture different HTTP methods
    const routeRegex =
      /\.(get|post|put|delete|patch|options|head)\s*\(\s*\.\.\.createRoute\s*\(\s*['"`]([^'"`]+)['"`]\s*,\s*([^)]+)\s*\)\s*\)/g
    let match: RegExpExecArray | [any, any, any, any] | null

    while ((match = routeRegex.exec(content)) !== null) {
      const [, method, route, handler] = match

      this.routes.push({
        file: routerFile,
        handler: handler.trim(),
        method: method.toUpperCase(),
        route,
      })
    }
  }

  private async scanConstantsFile(constantsFile: string): Promise<void> {
    const fullPath = path.resolve(this.baseDir, constantsFile)
    const content = fs.readFileSync(fullPath, 'utf-8')

    // Look for exported const arrays with 'as const'
    const constantsRegex = /export\s+const\s+(\w+)\s*=\s*\[([\s\S]*?)\]\s+as\s+const/g
    let match: RegExpExecArray | null

    while ((match = constantsRegex.exec(content)) !== null) {
      const [, constantName, arrayContent] = match

      // Extract string values from the array
      const stringValues = arrayContent
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('//') && !line.startsWith('/*'))
        .map((line) => {
          // Extract string values, handling both 'value' and "value" formats
          const stringMatch = line.match(/['"`]([^'"`]+)['"`]/)
          return stringMatch ? stringMatch[1] : null
        })
        .filter((value): value is string => value !== null)

      if (stringValues.length > 0) {
        // Generate type name (e.g., AuthMessages -> AuthMessagesType)
        const typeName = `${constantName}Type`

        this.messageConstants.push({
          file: constantsFile,
          name: constantName,
          type: typeName,
          values: stringValues,
        })
      }
    }
  }

  private findControllerFunction(handlerName: string): ControllerFunction | undefined {
    for (const controller of this.controllers) {
      const func = controller.functions.find((f) => f.name === handlerName)
      if (func) return func
    }
    return undefined
  }

  generateTypesFile(): void {
    console.log('Generating enhanced index.d.ts...')

    let output = `// THIS FILE IS AUTO-GENERATED. DO NOT EDIT.\n\n`

    // Add imports for all controllers
    const controllerImports = this.controllers
      .map((ctrl) => {
        const importPath = `./${ctrl.file.replace(/\.ts$/, '')}`
        return `import { ${ctrl.functions.map((f) => f.name).join(', ')} } from '${importPath}'`
      })
      .join('\n')

    // Add imports for all message constants
    const constantsImports = this.messageConstants
      .map((msgConst) => {
        const importPath = `./${msgConst.file.replace(/\.ts$/, '')}`
        return `import { ${msgConst.name} } from '${importPath}'`
      })
      .join('\n')

    output += controllerImports + '\n'
    if (constantsImports) {
      output += constantsImports + '\n'
    }
    output += '\n'

    // Generate ApiRoutes interface using Parameters and ReturnType with simple metadata
    output += `export interface ApiRoutes {\n`

    for (const route of this.routes) {
      const handlerFunc = this.findControllerFunction(route.handler)
      const reqType = handlerFunc ? `Parameters<typeof ${route.handler}>[0]` : 'any'
      const resType = handlerFunc ? `Awaited<ReturnType<typeof ${route.handler}>>` : 'any'

      // Extract router name from file path (e.g., 'server/auth/auth.router.ts' -> 'auth')
      const routerName = route.file.split('/').pop()?.replace('.router.ts', '') || 'unknown'

      output += `  '${route.route}': { req: ${reqType}; res: ${resType}; method: '${route.method}'; router: '${routerName}' }\n`
    }

    output += `}\n\n`

    // Generate I18N types for message constants
    for (const msgConst of this.messageConstants) {
      output += `export type ${msgConst.type} = (typeof ${msgConst.name})[number]\n`
      output += `export type I18${msgConst.name} = Record<${msgConst.type}, string>\n\n`
    }

    // Add GetRes utility type at the end
    output += `export type GetRes<T extends keyof ApiRoutes> = ApiRoutes[T]['res']\n`

    fs.writeFileSync(this.typesFile, output)
    console.log('Enhanced index.d.ts generated successfully!')
  }

  async run(): Promise<void> {
    try {
      await this.scanCodebase()
      this.generateTypesFile()

      console.log('\nAdvanced route scanner completed successfully!')
      console.log('\nGenerated file:')
      console.log('- index.d.ts (Type definitions with Parameters and ReturnType)')
    } catch (error) {
      console.error('Error during advanced route scanning:', error)
      process.exit(1)
    }
  }
}

// Run the advanced scanner
const scanner = new AdvancedRouteScanner()
scanner.run()
