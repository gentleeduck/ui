import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

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
