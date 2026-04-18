import type { RegistryBuildFramework } from '../../extensions/ui/ui.config.types'
import type { IRegistryBuildComponentIndexAdapter } from './component-index.types'
import { createComponentIndexEntry, createNextjsComponentImport, NEXTJS_COMPONENT_INDEX_HEADER } from './nextjs'
import { createViteComponentImport, VITE_COMPONENT_INDEX_HEADER } from './vite'

/**
 * Resolve the framework adapter that renders the generated component index.
 */
export function getComponentIndexAdapter(framework: RegistryBuildFramework): IRegistryBuildComponentIndexAdapter {
  switch (framework) {
    case 'nextjs':
      return {
        defaultHeader: NEXTJS_COMPONENT_INDEX_HEADER,
        renderEntry: createComponentIndexEntry,
        renderImport: createNextjsComponentImport,
      }
    case 'vite':
      return {
        defaultHeader: VITE_COMPONENT_INDEX_HEADER,
        renderEntry: createComponentIndexEntry,
        renderImport: (options: { componentPath: string; id: string; ssr: boolean }) =>
          createViteComponentImport({ componentPath: options.componentPath, id: options.id }),
      }
    case 'custom':
      return {
        defaultHeader: '',
        renderEntry: createComponentIndexEntry,
        renderImport: () => '',
      }
  }
}
