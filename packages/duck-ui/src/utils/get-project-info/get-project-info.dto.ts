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
    charset: StringOrNull,
    composite: BooleanOrNull,
    customConditions: ArrayOfStringsOrNull,
    declaration: BooleanOrNull,
    declarationDir: StringOrNull,
    diagnostics: BooleanOrNull,
    disableReferencedProjectLoad: BooleanOrNull,
    noPropertyAccessFromIndexSignature: BooleanOrNull,
    emitBOM: BooleanOrNull,
    emitDeclarationOnly: BooleanOrNull,
    erasableSyntaxOnly: BooleanOrNull,
    exactOptionalPropertyTypes: BooleanOrNull,
    incremental: BooleanOrNull,
    tsBuildInfoFile: StringOrNull,
    inlineSourceMap: BooleanOrNull,
    inlineSources: BooleanOrNull,
    jsx: z.enum(['preserve', 'react', 'react-jsx', 'react-jsxdev', 'react-native']).optional(),
    jsxFactory: StringOrNull,
    jsxFragmentFactory: StringOrNull,
    jsxImportSource: StringOrNull,
    listFiles: BooleanOrNull,
    mapRoot: StringOrNull,
    module: z
      .enum([
        'CommonJS',
        'AMD',
        'System',
        'UMD',
        'ES6',
        'ES2015',
        'ES2020',
        'ESNext',
        'None',
        'ES2022',
        'Node16',
        'Node18',
        'NodeNext',
        'Preserve',
      ])
      .optional(),
    moduleResolution: z.enum(['classic', 'node', 'node10', 'node16', 'nodenext', 'bundler']).optional(),
    newLine: z.enum(['crlf', 'lf']).optional(),
    noEmit: BooleanOrNull,
    noEmitHelpers: BooleanOrNull,
    noEmitOnError: BooleanOrNull,
    noImplicitAny: BooleanOrNull,
    noImplicitThis: BooleanOrNull,
    noUnusedLocals: BooleanOrNull,
    noUnusedParameters: BooleanOrNull,
    noLib: BooleanOrNull,
    noResolve: BooleanOrNull,
    noStrictGenericChecks: BooleanOrNull,
    skipDefaultLibCheck: BooleanOrNull,
    skipLibCheck: BooleanOrNull,
    outFile: StringOrNull,
    outDir: StringOrNull,
    preserveConstEnums: BooleanOrNull,
    preserveSymlinks: BooleanOrNull,
    preserveValueImports: BooleanOrNull,
    preserveWatchOutput: BooleanOrNull,
    pretty: BooleanOrNull,
    removeComments: BooleanOrNull,
    rewriteRelativeImportExtensions: BooleanOrNull,
    rootDir: StringOrNull,
    isolatedModules: BooleanOrNull,
    sourceMap: BooleanOrNull,
    sourceRoot: StringOrNull,
    suppressExcessPropertyErrors: BooleanOrNull,
    suppressImplicitAnyIndexErrors: BooleanOrNull,
    stripInternal: BooleanOrNull,
    target: z
      .enum([
        'ES3',
        'ES5',
        'ES6',
        'ES2015',
        'ES2016',
        'ES2017',
        'ES2018',
        'ES2019',
        'ES2020',
        'ES2021',
        'ES2022',
        'ES2023',
        'ES2024',
        'ESNext',
      ])
      .optional(),
    useUnknownInCatchVariables: BooleanOrNull,
    watch: BooleanOrNull,
    experimentalDecorators: BooleanOrNull,
    emitDecoratorMetadata: BooleanOrNull,
    allowUnusedLabels: BooleanOrNull,
    noImplicitReturns: BooleanOrNull,
    noUncheckedIndexedAccess: BooleanOrNull,
    noFallthroughCasesInSwitch: BooleanOrNull,
    noImplicitOverride: BooleanOrNull,
    allowUnreachableCode: BooleanOrNull,
    forceConsistentCasingInFileNames: BooleanOrNull,
    generateCpuProfile: StringOrNull,
    baseUrl: StringOrNull,
    paths: z.record(z.array(z.string())).optional(),
    plugins: z.array(z.object({ name: z.string() })).optional(),
    rootDirs: ArrayOfStringsOrNull,
    typeRoots: ArrayOfStringsOrNull,
    types: ArrayOfStringsOrNull,
    allowJs: BooleanOrNull,
    noErrorTruncation: BooleanOrNull,
    allowSyntheticDefaultImports: BooleanOrNull,
    noImplicitUseStrict: BooleanOrNull,
    listEmittedFiles: BooleanOrNull,
    disableSizeLimit: BooleanOrNull,
    lib: ArrayOfStringsOrNull,
    strictNullChecks: BooleanOrNull,
    maxNodeModuleJsDepth: z.number().optional(),
    importHelpers: BooleanOrNull,
    alwaysStrict: BooleanOrNull,
    strict: BooleanOrNull,
    strictBindCallApply: BooleanOrNull,
    downlevelIteration: BooleanOrNull,
    checkJs: BooleanOrNull,
    strictFunctionTypes: BooleanOrNull,
    strictPropertyInitialization: BooleanOrNull,
    esModuleInterop: BooleanOrNull,
    allowUmdGlobalAccess: BooleanOrNull,
    keyofStringsOnly: BooleanOrNull,
    useDefineForClassFields: BooleanOrNull,
    declarationMap: BooleanOrNull,
    resolveJsonModule: BooleanOrNull,
    resolvePackageJsonExports: BooleanOrNull,
    resolvePackageJsonImports: BooleanOrNull,
    extendedDiagnostics: BooleanOrNull,
    disableSourceOfProjectReferenceRedirect: BooleanOrNull,
    disableSolutionSearching: BooleanOrNull,
    verbatimModuleSyntax: BooleanOrNull,
    noCheck: BooleanOrNull,
    isolatedDeclarations: BooleanOrNull,
    noUncheckedSideEffectImports: BooleanOrNull,
    strictBuiltinIteratorReturn: BooleanOrNull,
  })
  .partial()
  .nullable()
  .optional()

const WatchOptions = z
  .object({
    watchFile: z
      .enum([
        'fixedPollingInterval',
        'priorityPollingInterval',
        'dynamicPriorityPolling',
        'useFsEvents',
        'useFsEventsOnParentDirectory',
        'fixedChunkSizePolling',
      ])
      .optional(),
    watchDirectory: z
      .enum(['useFsEvents', 'fixedPollingInterval', 'dynamicPriorityPolling', 'fixedChunkSizePolling'])
      .optional(),
    fallbackPolling: z
      .enum([
        'fixedPollingInterval',
        'priorityPollingInterval',
        'dynamicPriorityPolling',
        'fixedInterval',
        'priorityInterval',
        'dynamicPriority',
        'fixedChunkSize',
      ])
      .optional(),
    synchronousWatchDirectory: BooleanOrNull,
    excludeFiles: ArrayOfStringsOrNull,
    excludeDirectories: ArrayOfStringsOrNull,
  })
  .partial()
  .nullable()
  .optional()

const BuildOptions = z
  .object({
    dry: BooleanOrNull,
    force: BooleanOrNull,
    verbose: BooleanOrNull,
    incremental: BooleanOrNull,
    assumeChangesOnlyAffectDirectDependencies: BooleanOrNull,
    traceResolution: BooleanOrNull,
  })
  .partial()
  .nullable()
  .optional()

const TypeAcquisition = z
  .object({
    enable: BooleanOrNull,
    include: ArrayOfStringsOrNull,
    exclude: ArrayOfStringsOrNull,
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
    experimentalSpecifierResolution: z.enum(['explicit', 'node']).optional(),
    files: z.boolean().optional(),
    ignore: z.array(z.string()).optional(),
    ignoreDiagnostics: z.array(z.union([z.string(), z.number()])).optional(),
    logError: z.boolean().optional(),
    moduleTypes: z.record(z.enum(['cjs', 'esm', 'package'])).optional(),
    preferTsExts: z.boolean().optional(),
    pretty: z.boolean().optional(),
    require: z.array(z.string()).optional(),
    scope: z.boolean().optional(),
    scopeDir: z.string().optional(),
    skipIgnore: z.boolean().optional(),
    swc: z.boolean().optional(),
    transpileOnly: z.boolean().optional(),
    transpiler: z.union([z.string(), z.tuple([z.string(), z.record(z.any())])]).optional(),
    typeCheck: z.boolean().optional(),
  })
  .partial()
  .optional()

// Main tsconfig schema
export const ts_config_schema = z
  .object({
    extends: z.union([z.string(), z.array(z.string())]).optional(),
    compileOnSave: BooleanOrNull,
    files: ArrayOfStringsOrNull,
    include: ArrayOfStringsOrNull,
    exclude: ArrayOfStringsOrNull,
    references: References,
    compilerOptions: CompilerOptions,
    watchOptions: WatchOptions,
    buildOptions: BuildOptions,
    typeAcquisition: TypeAcquisition,
    'ts-node': TsNodeOptions,
  })
  .partial()
  .passthrough()
export type TsConfig = z.infer<typeof ts_config_schema>
