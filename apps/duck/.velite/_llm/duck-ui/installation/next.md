Create project

Run the `init` command to create a new Next.js project or to setup an existing one:

```bash
npx @gentleduck/cli init
```

Choose between a Next.js project or a Monorepo.

Add Components

You can now start adding components to your project.

```bash
npx @gentleduck/cli add button
```

The command above will add the `Button` component to your project. You can then import it like this:

```tsx {1,6} showLineNumbers title="app/page.tsx"

export default function Home() {
  return (

      <Button>Click me</Button>

  )
}
```