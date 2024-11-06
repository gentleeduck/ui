import { z } from 'zod'
import fs from 'fs/promises'
import path from 'path'
import rimraf from 'rimraf'
import { registry_schema } from '@/registry'
import { REGISTRY_PATH } from '../main'
import { get_component_files } from './build-registry-index.lib'

// ----------------------------------------------------------------------------
export async function build_registry_index(registry: z.infer<typeof registry_schema>) {
    try {
        // 1- getting the component path.
        const items = await Promise.all(
            registry.filter(item => ['registry:ui'].includes(item.type)).map(item => get_component_files(item))
        )

        const example_items = await Promise.all(
            registry.filter(item => ['registry:example'].includes(item.type)).map(item => get_component_files(item))
        )
        const example_items_mapped = example_items.flatMap(item => {
            const files = item.files.splice(1)

            return [
                {
                    ...item,
                    files: [item.files[0]],
                },
                ...files.map(file => ({
                    ...item,
                    name: `${item.name.split('-')[0]}-${file.path.split('/').splice(-1).toString().split('.')[0].split('-')[1]}`,
                    files: [file],
                })),
            ]
        })

        // console.dir(items, { depth: 10 })

        // 2- making it as json and remove the (index.json) file and replace it with the new one.
        const registryJson = JSON.stringify([...items, ...example_items_mapped], null, 2)
        rimraf.sync(path.join(REGISTRY_PATH, 'index.json'))
        await fs.writeFile(path.join(REGISTRY_PATH, 'index.json'), registryJson, 'utf8')

        return [...items, ...example_items_mapped]
    } catch (error) {
        console.dir({
            message: 'Failed to build registry index.',
            error,
            cwd: process.cwd(),
        })
    }
}
