import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@gentleduck/registry-ui/input-group'
import { Loader } from 'lucide-react'

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return <Loader aria-label="Loading" className={'size-4 animate-spin'} role="status" {...props} />
}

export default function Demo() {
  return (
    <div className="grid w-full max-w-sm gap-4">
      <InputGroup data-disabled>
        <InputGroupInput disabled placeholder="Uploading assets..." />
        <InputGroupAddon align="inline-end">
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup data-disabled>
        <InputGroupInput disabled placeholder="Connecting to server..." />
        <InputGroupAddon>
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup data-disabled>
        <InputGroupInput disabled placeholder="Syncing changes..." />
        <InputGroupAddon align="inline-end">
          <InputGroupText>Syncing...</InputGroupText>
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup data-disabled>
        <InputGroupInput disabled placeholder="Validating configuration..." />
        <InputGroupAddon>
          <Loader className="animate-spin" />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InputGroupText className="text-muted-foreground">Almost done...</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
