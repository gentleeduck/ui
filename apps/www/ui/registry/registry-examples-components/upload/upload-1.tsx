'use client'

import { Separator } from '@/registry/default/ui'
import { Button, buttonVariants } from '@/registry/registry-ui-components/button'
import {
  UploadAdvancedProvider,
  UploadAdvancedButton,
  UploadAdnvacedContent,
  useUploadAdvancedContext,
  deleteFromFolderContent,
} from '@/registry/registry-ui-components/upload'
import { Download, RefreshCw, Trash, X } from 'lucide-react'
import React from 'react'
import {
  FolderButton,
  UploadAlertDeleteAction,
  UploadAlertMoveAction,
  UploadSearch,
  UploadViewButton,
} from '@/registry/registry-ui-components/upload/upload-chunks'
import { cn } from '@/lib'

export const UploadAdvancedHeader = React.memo(() => {
  const { selecttedAttachment, setSelectedAttachment, setAttachments } = useUploadAdvancedContext()

  return (
    <div className="w-full h-[45px] overflow-hidden relative">
      <div
        className={cn(
          'space-x-2 flex items-center place-content-end w-full m-0 p-2 transition-all duration-300 ease-in-out',
          selecttedAttachment.length > 0 ? 'translate-y-[-42px]' : 'translate-y-0'
        )}
      >
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
      <div
        className={cn(
          'absolute top-1/2 -translate-y-1/2 space-x-2 flex items-center w-full m-0 p-2 transition-all duration-300 ease-in-out bg-background pointer-events-all',
          selecttedAttachment.length > 0 ? '' : 'opacity-0 t anslate-y-[-42px] pointer-events-none'
        )}
      >
        <Button
          size={'xs'}
          variant={'nothing'}
          onClick={() => setSelectedAttachment([])}
          icon={{ children: X }}
        />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {selecttedAttachment.length} Attachment
            {selecttedAttachment.length === 1 ? ' is' : 's are'} selected
          </span>
          <Separator
            orientation="vertical"
            className="h-6"
          />
          <Button
            size={'xs'}
            border={'default'}
            icon={{ children: Download }}
          >
            Download
          </Button>
          <Separator
            orientation="vertical"
            className="h-6"
          />
          <UploadAlertMoveAction
            itemName="duck-ui-bucket"
            onCancel={() => console.log('cancel')}
            onContinue={() => console.log('continue')}
          />
          <UploadAlertDeleteAction
            itemName={`${selecttedAttachment.length} item${
              selecttedAttachment.length === 1 ? '' : 's'
            } out of wildduck_bucket`}
            className={cn(
              buttonVariants({
                className: 'w-fit',
                size: 'xs',
                variant: 'destructive',
                border: 'destructive',
              })
            )}
            onCancel={() => {}}
            onContinue={() => {
              setAttachments(old => {
                return deleteFromFolderContent(old, [...selecttedAttachment.map(item => item.id)])
              })
              setSelectedAttachment([])
            }}
          />
        </div>
      </div>
    </div>
  )
})

export default function Upload1Demo() {
  return (
    <>
      <UploadAdvancedProvider
        attachments={[
          {
            id: 'ed2da76d-5a24-4e35-9542-e92ca2e49c34',
            name: 'gentelduck',
            size: '1MB',
            file: new File([], ''),
            type: 'image/png',
            url: '',
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
        <div className="flex flex-col w-full rounded-md bg-muted/10 border-border border h-[600px] overflow-hidden">
          <UploadAdvancedHeader />
          <Separator />
          <UploadAdnvacedContent />
        </div>
      </UploadAdvancedProvider>
    </>
  )
}
