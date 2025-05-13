import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {

  return (
    <button
      type="button"
    >
      Add 1 to ?
    </button>
  )
}