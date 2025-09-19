// 'use client'
//
// import { randFileName, randFileType, randNumber, randUuid } from '@ngneat/falso'
// import { UseQueryResult } from '@tanstack/react-query'
// import React from 'react'
// import { uuidv7 } from 'uuidv7'
// import { Button } from '@/registry/default/ui/button'
// import {
//   UploadAdnvacedContent,
//   UploadAdvancedHeader,
//   UploadAdvancedProvider,
//   UploadServerActions,
// } from '@/registry/registry-ui-components/upload'
// import { trpc } from '@/trpc/react'
//
// // Example random attachment URLs
// const randomAttachments = [
//   'https://images.pexels.com/photos/30149547/pexels-photo-30149547/free-photo-of-classic-muscle-cars-racing-on-turkish-highway.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   'https://images.pexels.com/photos/30147400/pexels-photo-30147400/free-photo-of-winter-street-view-in-palu-elazig-turkiye.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   'https://images.pexels.com/photos/30151773/pexels-photo-30151773/free-photo-of-sunset-street-scene-with-palm-trees-and-bookstore.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   'https://images.pexels.com/photos/30151708/pexels-photo-30151708/free-photo-of-bustling-hollywood-boulevard-street-scene.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   'https://images.pexels.com/photos/30166411/pexels-photo-30166411/free-photo-of-vibrant-yellow-sports-car-on-sunny-day.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   'https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   'https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   'https://images.pexels.com/photos/18003063/pexels-photo-18003063/free-photo-of-a-blue-porsche-car-parked-on-the-street.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   'https://images.pexels.com/photos/1077785/pexels-photo-1077785.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//   'https://images.pexels.com/photos/2434625/pexels-photo-2434625.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
// ]
//
// // -----------------------------------------------------------------------------------------------
// // NOTE: Generator for dummy data.
// const generateFile = (treeLevel: number): FileType => {
//   const fileName = randFileName()
//   const fileType = 'image/png' // You can modify this to randomly generate file types if needed
//   const randomUrl = randomAttachments[Math.floor(Math.random() * randomAttachments.length)] // Randomly select URL from randomAttachments
//
//   return {
//     createdAt: new Date(),
//     file: new File([], fileName),
//     id: uuidv7(),
//     name: fileName,
//     size: '1MB',
//     treeLevel, // Pass the treeLevel for file
//     type: fileType,
//     updated_at: new Date(),
//     url: randomUrl,
//   }
// }
//
// const MAX_DEPTH = 3 // Set a maximum depth for folder nesting
//
// const generateFolder = (level: number): FolderType => {
//   const folderName = randFileName().split('.')[0]
//   const numFiles = randNumber({ max: 2, min: 2 }) // Random number of files
//   const numNestedFolders = level < MAX_DEPTH ? randNumber({ max: 1, min: 1 }) : 0 // Limit nested folders based on depth
//
//   const content: (FileType | FolderType)[] = []
//
//   // Generate files with the current tree level
//   for (let i = 0; i < numFiles; i++) {
//     content.push(generateFile(level)) // Pass current level to files
//   }
//
//   // Generate nested folders if not at max depth
//   for (let i = 0; i < numNestedFolders; i++) {
//     content.push(generateFolder(level + 1)) // Pass incremented level to nested folders
//   }
//
//   return {
//     content,
//     created_at: new Date(),
//     files: content.length,
//     id: randUuid(),
//     name: folderName,
//     tree_level: level, // Assign the current level to the folder
//     updated_at: new Date(),
//   }
// }
//
// // Generate the root folder with a set number of subfolders
// const attachments: FolderType[] = Array.from({ length: 1 }, (_, i) => generateFolder(1)) // Start with level 1 for the root folder
//
// export default function Upload4Demo() {
//   // 1- make req to server to get attachments and give to the provider
//
//   return (
//     <>
//       <UploadAdvancedProvider
//         // attachments={attachments} // Pass generated attachments here
//         actions={serverActions}
//         currentBucket="wildduck_attachments">
//         <UploadAdvancedHeader />
//         <UploadAdnvacedContent />
//       </UploadAdvancedProvider>
//     </>
//   )
// }
//
// export const serverActions: UploadServerActions = {
//   getFolder: (async (_folder) => {
//     const folder = await trpc.upload.getFolder.query({
//       bucket_id: '0194e212-4f7a-7252-9636-a04fb2f5ea3e',
//       folder_id: _folder?.id ?? '',
//     })
//     return folder
//   }) as UploadServerActions['getFolder'],
//   getInitial: (async (ctx) => {
//     const { data } = await trpc.upload.getBucket.query({ bucket_id: '0194e212-4f7a-7252-9636-a04fb2f5ea3e' })
//
//     if (!data) return {}
//     ctx.setAttachments({
//       data: data,
//       state: 'success',
//     })
//   }) as UploadServerActions['getInitial'],
//
//   insertFolder: (async (_folder) => {
//     const folder = await trpc.upload.insertFolder.mutate(_folder)
//     return folder
//   }) as UploadServerActions['insertFolder'],
//
//   upload: (async (newAttachments) => {
//     return await trpc.upload.insertFile.mutate(newAttachments[0]!)
//   }) as UploadServerActions['upload'],
// }
//
// export async function foo() {
//   const folder = await trpc.upload.getFolder.query({
//     bucket_id: '0194e212-4f7a-7252-9636-a04fb2f5ea3e',
//     folder_id: '0194e212-4f7a-7252-9636-a04fb2f5ea3e',
//   })
//   return folder
// }
//
// export async function fooAxios() {
//   const { data } = await fetch('http://localhost:4000/trpc/upload.getFolder', {
//     bucket_id: '0194e212-4f7a-7252-9636-a04fb2f5ea3e',
//     folder_id: '0194e212-4f7a-7252-9636-a04fb2f5ea3e',
//   })
//   const folder = await trpc.upload.getFolder.query({
//     bucket_id: '0194e212-4f7a-7252-9636-a04fb2f5ea3e',
//     folder_id: '0194e212-4f7a-7252-9636-a04fb2f5ea3e',
//   })
//   return folder
// }
