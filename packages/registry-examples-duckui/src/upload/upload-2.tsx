import { Button } from '@/registry/registry-ui-components/button'
import {
  Upload,
  UploadContent,
  UploadInput,
  UploadItemsPreview,
  UploadProvider,
  UploadTrigger,
} from '@/registry/registry-ui-components/upload'
import { UploadIcon } from 'lucide-react'

export default function Upload2Demo() {
  return (
    <>
      <UploadProvider>
        <div className="flex flex-col w-full gap-4">
          <div className="place-self-end">
            <Upload
              trigger={
                <UploadTrigger>
                  <Button
                    variant="outline"
                    type="button"
                    icon={{
                      children: UploadIcon,
                    }}>
                    Upload
                  </Button>
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
    </>
  )
}
