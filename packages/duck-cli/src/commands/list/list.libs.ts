import { printBanner } from '~/utils/banner'
import { getRegistryIndex } from '~/utils/get-registry'
import { spinner as Spinner } from '~/utils/spinner'
import { highlighter } from '~/utils/text-styling'
import { isVerbose } from '~/utils/verbose'
import { type ListOptions, listOptionsSchema } from './list.dto'

export async function listCommandAction(opt: ListOptions) {
  const options = listOptionsSchema.parse(opt)

  printBanner()
  const spinner = Spinner('Fetching registry...').start()
  try {
    const index = await getRegistryIndex()

    if (!index || index.length === 0) {
      spinner.fail('No components found in registry.')
      process.exit(1)
    }

    let components = index

    if (options.type) {
      const filterType = `registry:${options.type}` as const
      components = index.filter((c) => c.type === filterType)

      if (components.length === 0) {
        spinner.fail(`No components found with type: ${highlighter.info(options.type)}`)
        process.exit(1)
      }
    }

    spinner.stop()

    if (options.json) {
      const output = components.map((c) => ({
        name: c.name,
        type: c.type,
        description: c.description ?? '',
        dependencies: c.dependencies ?? [],
        registryDependencies: c.registryDependencies ?? [],
      }))
      console.log(JSON.stringify(output, null, 2))
    } else {
      console.log(`\nAvailable components (${components.length}):\n`)
      for (const component of components) {
        const type = component.type.split(':').pop()
        const desc = component.description ? ` - ${component.description}` : ''
        console.log(`  ${highlighter.info(component.name)} [${type}]${desc}`)
      }
      console.log()
    }

    process.exit(0)
  } catch (error) {
    spinner.fail(`Failed to list components: ${error instanceof Error ? error.message : String(error)}`)
    if (isVerbose() && error instanceof Error) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}
