import { ASTRO_COMPONENT_INDEX_HEADER, createAstroComponentImport } from './astro'
import { createComponentIndexEntry, createNextjsComponentImport, NEXTJS_COMPONENT_INDEX_HEADER } from './nextjs'
import { createViteComponentImport, VITE_COMPONENT_INDEX_HEADER } from './vite'
import type { RegistryBuildFramework } from '../types'

export function getComponentIndexAdapter(framework: RegistryBuildFramework) {
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
    case 'astro':
      return {
        defaultHeader: ASTRO_COMPONENT_INDEX_HEADER,
        renderEntry: createComponentIndexEntry,
        renderImport: () => createAstroComponentImport(),
      }
    case 'custom':
      return {
        defaultHeader: '',
        renderEntry: createComponentIndexEntry,
        renderImport: () => '',
      }
  }
}

