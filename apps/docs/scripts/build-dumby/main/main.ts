import fs from 'fs/promises'
import path from 'path'
import { randFileName, randFileType, randUuid, randDatabase, randNumber } from '@ngneat/falso'
import { uuidv7 } from 'uuidv7'
import { FileType, FolderType } from '@/registry/registry-ui-components'

// Define constants
const OUTPUT_PATH = path.join(process.cwd(), '/public/duck-ui/dumb-data/dumb-data.json')

const generateFile = (): FileType => {
  const fileName = randFileName()
  const fileType = randFileType()
  return {
    id: uuidv7(),
    name: fileName,
    size: '1MB',
    file: new File([], fileName),
    type: fileType,
    url: '',
    createdAt: new Date(),
    updated_at: new Date(),
    treeLevel: 1,
  }
}

const MAX_DEPTH = 3 // Set a maximum depth for folder nesting

const generateFolder = (level: number): FolderType => {
  const folderName = randFileName().split('.')[0]
  const numFiles = randNumber({ min: 1, max: 5 }) // Random number of files
  const numNestedFolders = level < MAX_DEPTH ? randNumber({ min: 1, max: 3 }) : 0 // Limit nested folders based on depth

  const content: (FileType | FolderType)[] = []

  // Generate files
  for (let i = 0; i < numFiles; i++) {
    content.push(generateFile())
  }

  // Generate nested folders if not at max depth
  for (let i = 0; i < numNestedFolders; i++) {
    content.push(generateFolder(level + 1))
  }

  return {
    id: randUuid(),
    name: folderName,
    files: content.length,
    content,
    created_at: new Date(),
    updated_at: new Date(),
    tree_level: level,
  }
}

// Write the generated data to a JSON file
const writeJsonToFile = async (data: any) => {
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(data, null, 2)) // Pretty print with indentation
  console.log(`Data successfully written to ${OUTPUT_PATH}`)
}

// Main function to generate and write the data
export const main = () => {
  const data = Array.from({ length: 10 }, (_, index) => generateFolder(index + 1))
  writeJsonToFile(data)
}
