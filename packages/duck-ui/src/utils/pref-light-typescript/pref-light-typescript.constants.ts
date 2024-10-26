import { PromptObject } from 'prompts'
import { highlighter } from '../text-styling'

export const typescript_prompts: PromptObject<string>[] = [
  {
    type: 'confirm',
    name: 'typescript',
    message: `Would you like to install ${highlighter.info('TypeScript')} (recommended)`,
    initial: false,
    active: 'yes',
    inactive: 'no'
  }
]

export const typescript_dependencies = ['typescript']

export const js_config = `{
  "compilerOptions": {
    "target": "es6",                   // Target ECMAScript version
    "module": "commonjs",               // Specify module code generation
    "baseUrl": ".",                     // Base directory for non-relative module names
    "paths": {                          // Path aliases for cleaner imports
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    },
    "jsx": "react-jsx",                 // Set JSX handling for React projects
    "allowSyntheticDefaultImports": true, // Allow default imports from modules with no default export
    "esModuleInterop": true,            // Import compatibility for CommonJS and ES modules
    "strict": true                      // Enable all strict type-checking options
  },
  "include": ["src"],                   // Include files in the src folder
  "exclude": ["node_modules", "dist"]   // Exclude folders from the config
}
`

export const ts_config = `{
  "compilerOptions": {
    "target": "es6", // Target ECMAScript version
    "module": "commonjs", // Module system used in Node.js
    "lib": ["dom", "es6", "dom.iterable", "scripthost"], // Standard library
    "jsx": "react-jsx", // JSX support for React
    "outDir": "./dist", // Output directory for compiled files
    "rootDir": "./src", // Root directory of source files
    "strict": true, // Enable strict type checking
    "moduleResolution": "node", // Module resolution strategy
    "esModuleInterop": true, // Allow default imports from CommonJS
    "skipLibCheck": true, // Skip type checking of declaration files
    "forceConsistentCasingInFileNames": true, // Enforce consistent file naming
    "resolveJsonModule": true, // Support importing JSON files
    "allowSyntheticDefaultImports": true, // Synthetic default imports for compatibility
    "baseUrl": ".", // Base directory for module resolution
    "paths": {
      // Define path aliases
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  },
  "include": ["src"], // Include all source files in the src directory
  "exclude": ["node_modules", "dist", "tests"] // Exclude directories from compilation
}
`
