'use client'

import { Button } from '@gentleduck/registry-ui/button'
import { toast } from 'sonner'

export default function Demo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button onClick={() => toast.success('File uploaded successfully')} variant="outline">
        Success
      </Button>
      <Button onClick={() => toast.error('Upload failed. Please try again.')} variant="outline">
        Error
      </Button>
      <Button onClick={() => toast.warning('Storage is almost full (90%)')} variant="outline">
        Warning
      </Button>
      <Button onClick={() => toast.info('Your file is queued for processing')} variant="outline">
        Info
      </Button>
      <Button
        onClick={() => {
          toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
            loading: 'Uploading file...',
            success: 'File uploaded successfully!',
            error: 'Upload failed',
          })
        }}
        variant="outline">
        Promise
      </Button>
    </div>
  )
}
