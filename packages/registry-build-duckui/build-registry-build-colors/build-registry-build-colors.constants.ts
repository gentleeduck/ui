export const BASE_STYLES_WITH_VARIABLES = `@import "tailwindcss";
@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));

:root {
  --radius: <%= cssVars.light.radius %>;

  <% Object.entries(cssVars.light).forEach(([key, value]) => { %>
  --<%= key %>: <%= value %>;
  <% }) %>
}

.dark {
  <% Object.entries(cssVars.dark).forEach(([key, value]) => { %>
  --<%= key %>: <%= value %>;
  <% }) %>
}

@theme inline {
  <% Object.keys(cssVars.light).forEach(key => { %>
  --color-<%= key.replace(/_/g, '-') %>: var(--<%= key %>);
  <% }) %>
}

@layer base {
  * {
    @apply border-border;
    scroll-behavior: smooth;
  }

  html {
    @apply scroll-smooth;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
    font-synthesis-weight: none;
    text-rendering: optimizeLegibility;
  }
}
`
