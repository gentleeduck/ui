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

export const Route = createFileRoute("/")({
  component: Home,
})

function Home() {
  return (

      <Button>Click me</Button>

  )
}
```