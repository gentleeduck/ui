import { Button } from '@gentleduck/registry-ui-duckui/button'
import {
  Upload,
  UploadContent,
  UploadInput,
  UploadItemsPreview,
  UploadProvider,
  UploadTrigger,
} from '@gentleduck/registry-ui-duckui/upload'
import { UploadIcon } from 'lucide-react'

export function Upload2Demo() {
  return (
    <div className="flex flex-col w-full gap-4 border">
      <UploadProvider>
        <div className="flex flex-col w-full gap-4">
          <div className="place-self-end">
            <Upload
              trigger={
                <UploadTrigger>
                  Upload
                  <Button variant="outline" type="button" icon={<UploadIcon />}></Button>
                </UploadTrigger>
              }
              content={
                <div className="flex flex-col h-full gap-4">
                  <UploadInput />
                  <UploadContent />
                </div>
              }
            />
          </div>
          <UploadItemsPreview />
        </div>
      </UploadProvider>
    </div>
  )
}
