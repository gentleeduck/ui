import { logger } from '../text-styling'
import {
  registry_base_color_schema,
  registry_index_schema,
  registry_item_schema
} from './get-registry.dto'
import { fetch_registry_url, is_url } from './get-registry.lib'

export async function get_registry_index() {
  try {
    const [result] = await fetch_registry_url(['index.json'])

    return registry_index_schema.parse(result)
  } catch (error) {
    logger.error({ args: [`Failed to fetch from registry.`, error] })
    return null
  }
}

export async function get_registry_item(
  name: Lowercase<string>,
  style: 'default'
) {
  try {
    const [result] = await fetch_registry_url([
      is_url(name) ? name : `styles/${style}/${name}.json`
    ])
    console.log(hi)

    return registry_item_schema.parse(hi)
  } catch (error) {
    logger.error({ args: [`Failed to fetch from registry.`, error] })
    return null
  }
}

export async function get_registry_base_color(baseColor: string) {
  try {
    const [result] = await fetch_registry_url([`colors/${baseColor}.json`])

    return registry_base_color_schema.parse(result)
  } catch (error) {
    logger.error({ args: [`Failed to fetch from registry.`, error] })
    return null
  }
}

const hi = {
  name: 'button',
  dependencies: ['@radix-ui/react-slot', 'command', 'tooltip'],
  registryDependencies: ['dialog'],
  files: [
    {
      name: 'button.tsx',
      path: 'src/components/button.tsx', // provide the correct path
      content:
        "import React from 'react'\n\nimport * as TooltipPrimitive from '@radix-ui/react-tooltip'\nimport { Slot } f"
    }
  ],
  type: 'components:ui'
}

const je = {
  name: 'button',
  dependencies: ['@radix-ui/react-slot', 'command', 'tooltip'],
  registryDependencies: ['dialog'],
  files: [
    {
      name: 'button.tsx',
      path: 'src/components/button.tsx', // provide the correct path
      content: `import React from 'react';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { Slot } from '@radix-ui/react-slot';

// Add more content here as needed...
`,
      type: 'components:ui' // specify a valid type
    }
  ],
  type: 'components:ui'
}
