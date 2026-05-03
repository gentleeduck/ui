Any question that might be related to this project you can find here.
Or you can ask it on our [GitHub repository](https://github.com/gentleeduck/duck-ui).

  
    
      What makes @gentleduck/ui different from other UI libraries?
    
    
      57 styled components backed by 35 headless primitives we built ourselves - not Radix. The primitives are 50-92% smaller than Radix (Alert Dialog: 1.6 KB vs 18.6 KB). The calendar engine is ~5 KB with 4 calendar systems vs react-day-picker's ~20 KB with 1. We also ship a keyboard command system, animation tokens, atom-based state management, and a CLI with interactive merge TUI. See the <a href="/docs/comparisons/vs-shadcn" className="text-primary hover:underline">full comparison with shadcn/ui</a>.
    
  

  
    
      Is @gentleduck/ui just another UI clone?
    
    
      No. The primitives are written from scratch with shared internals (Slot, Presence, Popper, focus scope) deduplicated across all 35 components. The calendar engine supports 4 calendar systems with 7 date adapters. The variant system adds memoization over class-variance-authority. The CLI has an interactive merge TUI for updating components without losing local changes. These are not wrappers around existing libraries - they are independent implementations with the same API patterns so migration is easy.
    
  

  
    
      Can I migrate from my current UI library?
    
    
      Yes. If you are on shadcn/ui, migration is a namespace swap - same component names, same compound patterns, same Tailwind classes. Both component sets coexist in the same project. Replace one component at a time with <code className="bg-muted px-2 py-1 rounded">npx @gentleduck/cli add button</code>. If you are on Radix, the primitive imports change from <code className="bg-muted px-2 py-1 rounded">@radix-ui/react-dialog</code> to <code className="bg-muted px-2 py-1 rounded">@gentleduck/primitives/dialog</code> with the same API. See the <a href="/docs/comparisons/vs-shadcn#migration" className="text-primary hover:underline">shadcn migration guide</a> or <a href="/docs/comparisons/vs-radix#migration" className="text-primary hover:underline">Radix migration guide</a>.
    
  

  
    
      How do I install and get started?
    
    
      Run <code className="bg-muted px-2 py-1 rounded">npx @gentleduck/cli init</code> to
      set up your project, then <code className="bg-muted px-2 py-1 rounded">npx @gentleduck/cli add button</code>
      (or any component name) to install specific components. Import and use them like any other React component.
    
  

  
    
      Is it production ready?
    
    
      It's used in production. Every component is optimized for performance, accessibility, and
      reliability. If something doesn't work, it gets fixed ASAP.
    
  

  
    
      How customizable are the components?
    
    
      Every component supports theme customization, style overrides, and composition patterns.
      Want to build your own components using our primitives? Go for it. Need to fork and modify something?
      Do it. Nothing is locked down.
    
  

  
    
      What about accessibility?
    
    
      Accessibility is part of every component. ARIA labels, keyboard navigation, screen reader support,
      focus management. We follow WCAG guidelines because shipping inaccessible products in 2026 is inexcusable.
    
  

  
    
      Does it work with TypeScript?
    
    
      Full TypeScript support with type definitions for every component. Autocomplete, type checking, and IntelliSense.
    
  

  
    
      How can I contribute or report issues?
    
    
      Head to our GitHub repository at{' '}
      <a href="https://github.com/gentleeduck/duck-ui" className="text-primary hover:underline">github.com/gentleeduck/duck-ui
      </a>. Report bugs, request features, submit pull requests, or improve documentation. We review 
      contributions quickly and actually respond. Good ideas get implemented, bad ideas get thoughtful 
      explanations. No corporate bureaucracy.
    
  

  
    
      What's the performance like?
    
    
      Real numbers: primitives are 50-92% smaller than Radix equivalents (Popover: 2.4 KB vs 19.6 KB, Dialog: 3.1 KB vs 10.6 KB). The calendar engine is ~5 KB vs react-day-picker's ~20 KB. The variant system caches results with a Map-based memoizer so repeated cva() calls in hot render paths return instantly. All packages are tree-shakeable ESM with <code className="bg-muted px-2 py-1 rounded">sideEffects: false</code>. See the <a href="/docs/packages/duck-primitives/benchmarks" className="text-primary hover:underline">full benchmarks</a>.
    
  

  
    
      Is there documentation and examples?
    
    
      Yes. Documentation, code examples, and real-world use cases. Written for developers who read docs.
    
  

  
    
      What's the license?
    
    
      MIT license. Use it for anything — personal projects, commercial products, client work.
    
  

  
    
      Does it support dark mode?
    
    
      Light, dark, and custom themes all ship in. The theming system handles dynamic switching, user preferences, and custom color schemes.
    
  

  
    
      Who maintains this project?
    
    
      @wildduck2 is the main maintainer, backed by the @gentleduck organization. Active development,
      responsive to community feedback, and committed long-term.
    
  

  
    
      Can I use this with Next.js, Remix, or other frameworks?
    
    
      Yes. We ship installation guides for <a href="/docs/installation/next" className="text-primary hover:underline">Next.js</a>, <a href="/docs/installation/vite" className="text-primary hover:underline">Vite</a>, <a href="/docs/installation/react-router" className="text-primary hover:underline">React Router</a>, <a href="/docs/installation/astro" className="text-primary hover:underline">Astro</a>, <a href="/docs/installation/laravel" className="text-primary hover:underline">Laravel</a>, <a href="/docs/installation/tanstack" className="text-primary hover:underline">TanStack Start</a>, and <a href="/docs/installation/manual" className="text-primary hover:underline">manual setup</a>. The CLI auto-detects your project type. React 18+ required.