import { Registry } from '../registry-schema'

export const registry_examples: Registry = [
  {
    name: 'button-main',
    type: 'registry:example',
    registryDependencies: ['button'],
    root_folder: 'registry-examples-components/button',
    files: [],
  },
  {
    name: 'badge-main',
    type: 'registry:example',
    registryDependencies: ['badge'],
    root_folder: 'registry-examples-components/badge',
    files: [],
  },
  {
    name: 'tooltip-main',
    type: 'registry:example',
    registryDependencies: ['tooltip'],
    root_folder: 'registry-examples-components/tooltip',
    files: [],
  },
  {
    name: 'accordion-main',
    type: 'registry:example',
    registryDependencies: ['accordion'],
    root_folder: 'registry-examples-components/accordion',
    files: [],
  },
  {
    name: 'toggle-group-main',
    type: 'registry:example',
    registryDependencies: ['toggle-group'],
    root_folder: 'registry-examples-components/toggle-group',
    files: [],
  },
]
