Create project

Start by creating a new Astro project:

```bash
npx create-astro@latest astro-app  --template with-tailwindcss --install --add react --git
```

Edit tsconfig.json file

Add the following code to the `tsconfig.json` file to resolve paths:

```ts title="tsconfig.json" {4-9} showLineNumbers
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

```astro title="src/pages/index.astro" {2,16} showLineNumbers
---

---

		
		
		
		<title>Astro + TailwindCSS</title>

			<Button>Button</Button>

```