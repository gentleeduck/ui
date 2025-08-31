'use client'

import React from 'react'
import {
  UploadAdvancedProvider,
  UploadAdnvacedContent,
  UploadAdvancedHeader,
  FolderType,
  FileType,
} from '@/registry/registry-ui-components/upload'
import { uuidv7 } from 'uuidv7'

export default function Upload4Demo() {
  return (
    <>
      <UploadAdvancedProvider attachments={attachments} currentBucket="wildduck_attachments">
        <UploadAdvancedHeader />
        <UploadAdnvacedContent />
      </UploadAdvancedProvider>
    </>
  )
}

// -----------------------------------------------------------------------------------------------
//NOTE: Generator for dumby data.
import { randFileName, randFileType, randNumber, randSentence, randUuid } from '@ngneat/falso'

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
  const folderName = randSentence() // Generate a random folder name
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

const attachments: FolderType[] = Array.from({ length: 10 }, (_, i) => generateFolder(i + 1))
