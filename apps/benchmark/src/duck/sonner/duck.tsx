import { Toaster } from '@gentleduck/registry-ui-duckui/sonner'
import { toast } from 'sonner'

export default function DrawerDemo() {
  return (
    <>
      <Toaster />

      <button
        onClick={() =>
          toast('Event has been created', {
            action: {
              label: 'Undo',
              onClick: () => console.log('Undo'),
            },
            description: 'Sunday, December 03, 2023 at 9:00 AM',
          })
        }>
        Show Toast
      </button>
    </>
  )
}
