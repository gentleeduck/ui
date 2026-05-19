Create project

```bash
npx create-tsrouter-app@latest my-app
```

Run the CLI

Run the `@gentleduck/cli` init command to setup your project:

```bash
npx @gentleduck/cli init
```

Add Components

You can now start adding components to your project.

```bash
npx @gentleduck/cli add button
```

The command above will add the `Button` component to your project. You can then import it like this:

```tsx showLineNumbers title="app/routes/home.tsx"
import { createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button>Click me</Button>
    </div>
  )
}
```