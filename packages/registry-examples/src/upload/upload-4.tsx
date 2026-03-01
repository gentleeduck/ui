// 'use client'
//
// import React from 'react'
// import { uuidv7 } from 'uuidv7'
// import {
//   FileType,
//   FolderType,
//   UploadAdnvacedContent,
//   UploadAdvancedHeader,
//   UploadAdvancedProvider,
// } from '@/registry/registry-ui-components/upload'
//
// export default function Upload4Demo() {
//   return (
//     <>
//       <UploadAdvancedProvider attachments={attachments} currentBucket="wildduck_attachments">
//         <UploadAdvancedHeader />
//         <UploadAdnvacedContent />
//       </UploadAdvancedProvider>
//     </>
//   )
// }
//
// // -----------------------------------------------------------------------------------------------
// //NOTE: Generator for dumby data.
// import { randFileName, randFileType, randNumber, randSentence, randUuid } from '@ngneat/falso'
//
// const generateFile = (): FileType => {
//   const fileName = randFileName()
//   const fileType = randFileType()
//   return {
//     createdAt: new Date(),
//     file: new File([], fileName),
//     id: uuidv7(),
//     name: fileName,
//     size: '1MB',
//     treeLevel: 1,
//     type: fileType,
//     updated_at: new Date(),
//     url: '',
//   }
// }
//
// const MAX_DEPTH = 3 // Set a maximum depth for folder nesting
//
// const generateFolder = (level: number): FolderType => {
//   const folderName = randSentence() // Generate a random folder name
//   const numFiles = randNumber({ max: 5, min: 1 }) // Random number of files
//   const numNestedFolders = level < MAX_DEPTH ? randNumber({ max: 3, min: 1 }) : 0 // Limit nested folders based on depth
//
//   const content: (FileType | FolderType)[] = []
//
//   // Generate files
//   for (let i = 0; i < numFiles; i++) {
//     content.push(generateFile())
//   }
//
//   // Generate nested folders if not at max depth
//   for (let i = 0; i < numNestedFolders; i++) {
//     content.push(generateFolder(level + 1))
//   }
//
//   return {
//     content,
//     created_at: new Date(),
//     files: content.length,
//     id: randUuid(),
//     name: folderName,
//     tree_level: level,
//     updated_at: new Date(),
//   }
// }
//
// const attachments: FolderType[] = Array.from({ length: 10 }, (_, i) => generateFolder(i + 1))
