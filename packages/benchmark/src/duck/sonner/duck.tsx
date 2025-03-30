import { toast } from 'sonner'
import { DefaultSonner } from '@gentelduck/registry-ui-duckui/sonner'

export default function DrawerDemo() {
  return (
    <>
      <DefaultSonner />

      <button
        onClick={() =>
          toast('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM',
            action: {
              label: 'Undo',
              onClick: () => console.log('Undo'),
            },
          })
        }
      >
        Show Toast
      </button>
    </>
  )
}
