MDX in this docs site is powered by **Velite + `@mdx-js/mdx`** with custom plugins and components.

This page is the source of truth for writing docs that render correctly here.

## What works

- Standard Markdown (CommonMark)
- GFM features (tables, task lists, strikethrough)
- JSX inside markdown
- `import` / `export` in MDX
- Custom docs components such as `Callout`, `Tabs`, `Steps`, `ComponentPreview`, and `ComponentSource`

}>
Use fenced code blocks, not indented code blocks. Indented code blocks are not supported in MDX.

## Required frontmatter

Every docs page should include frontmatter with at least:

```mdx
---
title: your-page-title
description: One sentence summary for nav/SEO.
---
```

## Project-specific components

### Callout

```mdx
} title="Tip">
Keep examples short and copy-pasteable.

```

### Steps + Step

```mdx

  Install dependencies
  Add the component
  Run your app

```

### Tabs

```mdx

  
    npm
    pnpm
  
  

~~~bash
npm install your-package
~~~

  
  

~~~bash
pnpm add your-package
~~~

  

```

### ComponentPreview

Use this to render an interactive preview from the registry index.

```mdx

```

### ComponentSource

Use this to render source from a file or folder.

```mdx

```

- Path is resolved from monorepo root in this docs app pipeline.
- A directory path renders tabbed files; a single file path renders one code block.

## Code blocks

Use fenced blocks with language identifiers:

```mdx
~~~tsx title="components/demo.tsx" showLineNumbers
export function Demo() {
  return <div>Hello</div>
}
~~~
```

## MDX gotchas

- Autolink syntax like `<https://example.com>` is not supported in MDX. Use `[label](https://example.com)`.
- Unescaped `<` and `{` can break parsing; escape as `\<` and `\{` when they are plain text.
- HTML comments (`<!-- -->`) are not valid in MDX. Use `{/* comment */}`.

} title="Recommendation">
Prefer markdown for prose and JSX only when you need behavior (tabs, previews, callouts, custom layout).