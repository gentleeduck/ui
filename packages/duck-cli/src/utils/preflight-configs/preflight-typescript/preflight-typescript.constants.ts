import type { PromptObject } from 'prompts'
import { highlighter } from '../../text-styling'

export const typescript_prompts: PromptObject<'typescript'>[] = [
  {
    active: 'yes',
    inactive: 'no',
    initial: false,
    message: `Would you like to install ${highlighter.info('TypeScript')} (recommended)`,
    name: 'typescript',
    type: 'confirm',
  },
]

export const typescript_dependencies = ['typescript']

export const ts_config = `{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "lib": [
      "ES2022",
      "dom",
      "dom.iterable"
    ],
    "baseUrl": ".",
    "incremental": false,
    "rootDir": "./",
    "outDir": "./dist",
    "module": "Preserve",
    "allowImportingTsExtensions": true,
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "target": "ESNext",
    "allowJs": true,
    "resolveJsonModule": true,
    "moduleDetection": "force",
    "disableSourceOfProjectReferenceRedirect": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "checkJs": true,
    "noEmit": true,
    "composite": false,
    "declaration": true,
    "declarationMap": true,
    "inlineSources": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "preserveWatchOutput": true,
    "forceConsistentCasingInFileNames": true,
    "jsx": "preserve",
    "paths": {
      "~/*": [
        "./*"
      ]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": [
    "./**/*.ts",
    "./**/*.tsx"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "build",
  ]
}
`
