import { processNestJs } from './nestjs'

export * from './nestjs'

export function getFrameworkProcessor(framework: string) {
  switch (framework) {
    case 'nestjs':
      return processNestJs
    default:
      throw new Error(`Unsupported framework "${framework}"`)
  }
}
