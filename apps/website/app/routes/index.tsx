import { createFileRoute } from '@tanstack/react-router'
import {Button} from "@gentleduck/registry-ui-duckui/button"

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {

  return (
<>
    <Button>
      Add 1 to ?
    </Button>
    <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>

</>
  )
}