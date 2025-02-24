import fs from 'node:fs/promises'
import path from 'node:path'
import { REGISTRY_PATH } from '../main'
import { registry_schema, RegistryEntry } from '@/registry'
import { z } from 'zod'

// ----------------------------------------------------------------------------
export async function build_registry_styles_index(
  item: z.infer<typeof registry_schema>[number],
): Promise<void> {
  const dependencies = [
    'tailwindcss-animate',
    'class-variance-authority',
    'lucide-react',
  ]

  const payload: RegistryEntry = {
    name: item.name,
    type: 'registry:style',
    dependencies,
    registryDependencies: ['utils'],
    tailwind: {
      config: {
        plugins: [`require("tailwindcss-animate")`],
      },
    },
    root_folder: '',
    cssVars: {},
    files: [],
  }

  await fs.writeFile(
    path.join(REGISTRY_PATH, 'components', 'index.json'),
    JSON.stringify(payload, null, 2),
    'utf8',
  )
}
