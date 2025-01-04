'use client'

import { Separator } from '@/registry/default/ui'
import { Button } from '@/registry/registry-ui-components/button'
import {
  UploadAdvancedProvider,
  UploadAdvancedButton,
  UploadAdnvacedContent,
  useUploadAdvancedContext,
  searchNestedArrayIteratively,
  searchNestedArrayByKey,
} from '@/registry/registry-ui-components/upload'
import { RefreshCw } from 'lucide-react'
import React from 'react'
import { UploadNavigation } from './refactor'
import { FolderButton, UploadSearch, UploadViewButton } from '@/registry/registry-ui-components/upload/upload-chunks'

export const UploadDemoHeader = () => {
  return (
    <div className="space-x-2 flex items-center place-content-end w-full pb-1 p-2 ">
      <Button
        size={'xs'}
        icon={{ children: RefreshCw }}
      >
        Reload
      </Button>
      <UploadViewButton />
      <Separator
        orientation="vertical"
        className="h-6"
      />
      <UploadAdvancedButton />
      <FolderButton />
      <Separator
        orientation="vertical"
        className="h-6"
      />
      <UploadSearch />
    </div>
  )
}

export default function Upload1Demo() {
  return (
    <>
      <UploadAdvancedProvider
        attachments={[
          {
            id: 'ed2da76d-5a24-4e35-9542-e92ca2e49c34',
            name: 'gentelduck',
            files: 0,
            content: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            treeLevel: 1,
          },
          {
            id: '9c8f7a19-1752-4bd2-b308-90c553efd5b98',
            name: 'Download',
            files: 2,
            content: [
              {
                id: '20e93625-a645-4cdd-baf1-c01cded27a85fb',
                name: 'wilduck-2.png',
                size: '1MB',
                file: new File([], ''),
                url: '',
                type: 'image/png',
                treeLevel: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              {
                id: 'b23574f5-4aa0-4a89-8236-bd5699ac483ff',
                name: 'duck-scripts',
                files: 1,
                content: [
                  {
                    id: '20e93625-a645-4cdd-baf1-c01ced27a85bsdf',
                    name: 'wilduck-2.png',
                    size: '1MB',
                    file: new File([], ''),
                    url: '',
                    type: 'image/png',
                    treeLevel: 3,

                    createdAt: new Date(),
                    updatedAt: new Date(),
                  },
                ],
                createdAt: new Date(),
                updatedAt: new Date(),
                treeLevel: 2,
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
            treeLevel: 1,
          },
        ]}
      >
        <div className="flex flex-col w-full gap-1 rounded-md bg-muted/10 border-border border h-[80vh]">
          <div className="flex items-center gap-4 justify-between">
            <UploadNavigation />
            <UploadDemoHeader />
          </div>
          <Separator />
          <UploadAdnvacedContent />
        </div>
      </UploadAdvancedProvider>
    </>
  )
}
