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
import { randFileName, randFileType, randNumber, randUuid } from '@ngneat/falso'

// Example random attachment URLs
const randomAttachments = [
  'https://images.pexels.com/photos/28406651/pexels-photo-28406651/free-photo-of-historic-armenian-church-on-akdamar-island-van.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/27137595/pexels-photo-27137595/free-photo-of-facade-of-the-hotel-residence-maximus-in-rome.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/30009831/pexels-photo-30009831/free-photo-of-modern-wooden-facade-with-blue-windows.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/29371349/pexels-photo-29371349/free-photo-of-fashionable-man-in-orange-shirt-outdoors.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/21701368/pexels-photo-21701368/free-photo-of-cup-of-tea-and-candle-on-table.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/28905003/pexels-photo-28905003/free-photo-of-giraffes-crossing-rail-tracks-in-african-savanna.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  'https://images.pexels.com/photos/21336456/pexels-photo-21336456/free-photo-of-sage-bushes-in-arid-canyon-in-utah.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
]

// -----------------------------------------------------------------------------------------------
// NOTE: Generator for dummy data.
const generateFile = (): FileType => {
  const fileName = randFileName()
  const fileType = 'image/png' // You can modify this to randomly generate file types if needed
  const randomUrl = randomAttachments[Math.floor(Math.random() * randomAttachments.length)] // Randomly select URL from randomAttachments

  return {
    id: uuidv7(),
    name: fileName,
    size: '1MB',
    file: new File([], fileName),
    type: fileType,
    url: randomUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
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
    content.push(generateFile()) // Add a file with a random attachment URL
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
    createdAt: new Date(),
    updatedAt: new Date(),
    treeLevel: level,
  }
}

// Generate the root folder with a set number of subfolders
const attachments: FolderType[] = Array.from({ length: 1 }, (_, i) => generateFolder(i + 1))

export default function Upload4Demo() {
  console.log('Attachments:', attachments)
  return (
    <>
      <UploadAdvancedProvider
        attachments={attachments} // Pass generated attachments here
        currentBucket="wildduck_attachments"
      >
        <UploadAdvancedHeader />
        <UploadAdnvacedContent />
      </UploadAdvancedProvider>
    </>
  )
}
