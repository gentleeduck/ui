Create project

Start by creating a new React project using `vite`. Select the **React + TypeScript** template:

```bash
npm create vite@latest
```

Add Tailwind CSS

```bash
npm install tailwindcss @tailwindcss/vite
```

Replace everything in `src/index.css` with the following:

```css title="src/index.css"
@import "tailwindcss";
```

Edit tsconfig.json file

The current version of Vite splits TypeScript configuration into three files, two of which need to be edited.
Add the `baseUrl` and `paths` properties to the `compilerOptions` section of the `tsconfig.json` and
`tsconfig.app.json` files:

```ts title="tsconfig.json" {11-16} showLineNumbers
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Edit tsconfig.app.json file

Add the following code to the `tsconfig.app.json` file to resolve paths, for your IDE:

```ts title="tsconfig.app.json" {4-9} showLineNumbers
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
    // ...
  }
}
```

Update vite.config.ts

Add the following code to the vite.config.ts so your app can resolve paths without error:

```bash
npm install -D @types/node
```

```typescript title="vite.config.ts" showLineNumbers {1,2,8-13}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

Run the CLI

Run the `@gentleduck/cli` init command to setup your project:

```bash
npx @gentleduck/cli init
```

You will be asked a few questions to configure `components.json`.

```txt
Which color would you like to use as base color? › Neutral
```

Add Components

You can now start adding components to your project.

```bash
npx @gentleduck/cli add button
```

The command above will add the `Button` component to your project. You can then import it like this:

```tsx showLineNumbers title="src/App.tsx"

function App() {
  return (

      <Button>Click me</Button>

  )
}

export default App
```