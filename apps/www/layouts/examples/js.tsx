import { toast } from 'sonner'
import { SonnerUpload } from '../../../../packages/registry-ui-duckui/src/sonner/sonner-v2'
import { Button } from '@gentelduck/registry-ui-duckui/button'

export function SONNER_V2() {
  const controller = new AbortController()
  return (
    <>
      <Button
        onClick={() => {
          toast(
            <SonnerUpload
              progress={50}
              attachments={2}
              remainingTime={232323}
              onCancel={() => {
                toast.dismiss()
                controller.abort()
              }}
            />,
            { id: 'sonner' },
          )
        }}
      >
        sonner
      </Button>
    </>
  )
}
