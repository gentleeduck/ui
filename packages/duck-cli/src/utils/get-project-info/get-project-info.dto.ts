import { z } from 'zod'

// Helper schemas
const StringOrNull = z.union([z.string(), z.null()]).optional()
const BooleanOrNull = z.union([z.boolean(), z.null()]).optional()
const ArrayOfStringsOrNull = z.union([z.array(z.string()), z.null()]).optional()

// Sub-schemas
const CompilerOptions = z
  .object({
    allowArbitraryExtensions: BooleanOrNull,
    allowImportingTsExtensions: BooleanOrNull,
    allowJs: BooleanOrNull,
    allowSyntheticDefaultImports: BooleanOrNull,
    allowUmdGlobalAccess: BooleanOrNull,
    allowUnreachableCode: BooleanOrNull,
    allowUnusedLabels: BooleanOrNull,
    alwaysStrict: BooleanOrNull,
    baseUrl: StringOrNull,
    charset: StringOrNull,
    checkJs: BooleanOrNull,
    composite: BooleanOrNull,
    customConditions: ArrayOfStringsOrNull,
    declaration: BooleanOrNull,
    declarationDir: StringOrNull,
    declarationMap: BooleanOrNull,
    diagnostics: BooleanOrNull,
    disableReferencedProjectLoad: BooleanOrNull,
    disableSizeLimit: BooleanOrNull,
    disableSolutionSearching: BooleanOrNull,
    disableSourceOfProjectReferenceRedirect: BooleanOrNull,
    downlevelIteration: BooleanOrNull,
    emitBOM: BooleanOrNull,
    emitDeclarationOnly: BooleanOrNull,
    emitDecoratorMetadata: BooleanOrNull,
    erasableSyntaxOnly: BooleanOrNull,
    esModuleInterop: BooleanOrNull,
    exactOptionalPropertyTypes: BooleanOrNull,
    experimentalDecorators: BooleanOrNull,
    extendedDiagnostics: BooleanOrNull,
    forceConsistentCasingInFileNames: BooleanOrNull,
    generateCpuProfile: StringOrNull,
    importHelpers: BooleanOrNull,
    incremental: BooleanOrNull,
    inlineSourceMap: BooleanOrNull,
    inlineSources: BooleanOrNull,
    isolatedDeclarations: BooleanOrNull,
    isolatedModules: BooleanOrNull,
    jsx: z.string().optional(),
    jsxFactory: StringOrNull,
    jsxFragmentFactory: StringOrNull,
    jsxImportSource: StringOrNull,
    keyofStringsOnly: BooleanOrNull,
    lib: ArrayOfStringsOrNull,
    listEmittedFiles: BooleanOrNull,
    listFiles: BooleanOrNull,
    mapRoot: StringOrNull,
    maxNodeModuleJsDepth: z.number().optional(),
    module: z.string().optional(),
    moduleResolution: z.string().optional(),
    newLine: z.string().optional(),
    noCheck: BooleanOrNull,
    noEmit: BooleanOrNull,
    noEmitHelpers: BooleanOrNull,
    noEmitOnError: BooleanOrNull,
    noErrorTruncation: BooleanOrNull,
    noFallthroughCasesInSwitch: BooleanOrNull,
    noImplicitAny: BooleanOrNull,
    noImplicitOverride: BooleanOrNull,
    noImplicitReturns: BooleanOrNull,
    noImplicitThis: BooleanOrNull,
    noImplicitUseStrict: BooleanOrNull,
    noLib: BooleanOrNull,
    noPropertyAccessFromIndexSignature: BooleanOrNull,
    noResolve: BooleanOrNull,
    noStrictGenericChecks: BooleanOrNull,
    noUncheckedIndexedAccess: BooleanOrNull,
    noUncheckedSideEffectImports: BooleanOrNull,
    noUnusedLocals: BooleanOrNull,
    noUnusedParameters: BooleanOrNull,
    outDir: StringOrNull,
    outFile: StringOrNull,
    paths: z.record(z.string(), z.array(z.string())).optional(),
    plugins: z.array(z.object({ name: z.string() })).optional(),
    preserveConstEnums: BooleanOrNull,
    preserveSymlinks: BooleanOrNull,
    preserveValueImports: BooleanOrNull,
    preserveWatchOutput: BooleanOrNull,
    pretty: BooleanOrNull,
    removeComments: BooleanOrNull,
    resolveJsonModule: BooleanOrNull,
    resolvePackageJsonExports: BooleanOrNull,
    resolvePackageJsonImports: BooleanOrNull,
    rewriteRelativeImportExtensions: BooleanOrNull,
    rootDir: StringOrNull,
    rootDirs: ArrayOfStringsOrNull,
    skipDefaultLibCheck: BooleanOrNull,
    skipLibCheck: BooleanOrNull,
    sourceMap: BooleanOrNull,
    sourceRoot: StringOrNull,
    strict: BooleanOrNull,
    strictBindCallApply: BooleanOrNull,
    strictBuiltinIteratorReturn: BooleanOrNull,
    strictFunctionTypes: BooleanOrNull,
    strictNullChecks: BooleanOrNull,
    strictPropertyInitialization: BooleanOrNull,
    stripInternal: BooleanOrNull,
    suppressExcessPropertyErrors: BooleanOrNull,
    suppressImplicitAnyIndexErrors: BooleanOrNull,
    target: z.string().optional(),
    tsBuildInfoFile: StringOrNull,
    typeRoots: ArrayOfStringsOrNull,
    types: ArrayOfStringsOrNull,
    useDefineForClassFields: BooleanOrNull,
    useUnknownInCatchVariables: BooleanOrNull,
    verbatimModuleSyntax: BooleanOrNull,
    watch: BooleanOrNull,
  })
  .partial()
  .nullable()
  .optional()

const WatchOptions = z
  .object({
    excludeDirectories: ArrayOfStringsOrNull,
    excludeFiles: ArrayOfStringsOrNull,
    fallbackPolling: z.string().optional(),
    synchronousWatchDirectory: BooleanOrNull,
    watchDirectory: z.string().optional(),
    watchFile: z.string().optional(),
  })
  .partial()
  .nullable()
  .optional()

const BuildOptions = z
  .object({
    assumeChangesOnlyAffectDirectDependencies: BooleanOrNull,
    dry: BooleanOrNull,
    force: BooleanOrNull,
    incremental: BooleanOrNull,
    traceResolution: BooleanOrNull,
    verbose: BooleanOrNull,
  })
  .partial()
  .nullable()
  .optional()

const TypeAcquisition = z
  .object({
    enable: BooleanOrNull,
    exclude: ArrayOfStringsOrNull,
    include: ArrayOfStringsOrNull,
  })
  .partial()
  .nullable()
  .optional()

const References = z
  .array(
    z.object({
      path: StringOrNull,
    }),
  )
  .optional()

const TsNodeOptions = z
  .object({
    compiler: z.string().optional(),
    compilerHost: z.boolean().optional(),
    compilerOptions: CompilerOptions.optional(),
    emit: z.boolean().optional(),
    esm: z.boolean().optional(),
    experimentalReplAwait: z.boolean().optional(),
    experimentalResolver: z.boolean().optional(),
    experimentalSpecifierResolution: z.string().optional(),
    files: z.boolean().optional(),
    ignore: z.array(z.string()).optional(),
    ignoreDiagnostics: z.array(z.union([z.string(), z.number()])).optional(),
    logError: z.boolean().optional(),
    moduleTypes: z.record(z.string(), z.string()).optional(),
    preferTsExts: z.boolean().optional(),
    pretty: z.boolean().optional(),
    require: z.array(z.string()).optional(),
    scope: z.boolean().optional(),
    scopeDir: z.string().optional(),
    skipIgnore: z.boolean().optional(),
    swc: z.boolean().optional(),
    transpileOnly: z.boolean().optional(),
    transpiler: z.union([z.string(), z.tuple([z.string(), z.record(z.string(), z.any())])]).optional(),
    typeCheck: z.boolean().optional(),
  })
  .partial()
  .optional()

// Main tsconfig schema
export const ts_config_schema = z
  .looseObject({
    buildOptions: BuildOptions,
    compileOnSave: BooleanOrNull,
    compilerOptions: CompilerOptions,
    exclude: ArrayOfStringsOrNull,
    extends: z.union([z.string(), z.array(z.string())]).optional(),
    files: ArrayOfStringsOrNull,
    include: ArrayOfStringsOrNull,
    references: References,
    'ts-node': TsNodeOptions,
    typeAcquisition: TypeAcquisition,
    watchOptions: WatchOptions,
  })
  .partial()
export type TsConfig = z.infer<typeof ts_config_schema>
