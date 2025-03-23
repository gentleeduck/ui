export const BASE_COLORS_NAMES = ['slate', 'gray', 'zinc', 'neutral', 'stone']

export const BASE_STYLES = `@import "tailwindcss";`

export const BASE_STYLES_WITH_VARIABLES = `@import "tailwindcss";
@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));

@font-face {
  font-family: "Adjusted Lucida Sans Typewriter Fallback";
  src: local("Lucida Sans Typewriter");
  size-adjust: 119%;
  ascent-override: 86%;
  descent-override: 16%;
  line-gap-override: 30%;
}

@font-face {
  font-family: "Adjusted Arial Fallback";
  src: local("Arial");
  size-adjust: 99%;
  ascent-override: 101%;
  descent-override: 26%;
  line-gap-override: 0%;
}

@font-face {
  font-family: "Geist";
  font-weight: 100 900;
  font-display: swap;
  src: url(/fonts/Geist-VF.woff2) format("woff2");
}

@font-face {
  font-family: "Mono";
  font-weight: 500;
  font-display: fallback;
  src: url(/fonts/JetBrainsMono-MD.woff2) format("woff2");
}

:root {
  --font-sans: "Geist", "Adjusted Arial Fallback";
  --font-mono: "Mono", "Adjusted Lucida Sans Typewriter Fallback";

  --background: <%= light.background %>;
  --foreground: <%= light.foreground %>;
  --card: <%= light.card %>;
  --card-foreground: <%= light['card-foreground'] %>;
  --popover: <%= light.popover %>;
  --popover-foreground: <%= light['popover-foreground'] %>;
  --primary: <%= light.primary %>;
  --primary-foreground: <%= light['primary-foreground'] %>;
  --secondary: <%= light.secondary %>;
  --secondary-foreground: <%= light['secondary-foreground'] %>;
  --muted: <%= light.muted %>;
  --muted-foreground: <%= light['muted-foreground'] %>;
  --accent: <%= light.accent %>;
  --accent-foreground: <%= light['accent-foreground'] %>;
  --destructive: <%= light.destructive %>;
  --destructive-foreground: <%= light['destructive-foreground'] %>;
  --border: <%= light.border %>;
  --input: <%= light.input %>;
  --ring: <%= light.ring %>;
  --radius: <%= radius %>;
  
  <% Object.keys(light).filter(key => key.startsWith('chart')).forEach(key => { %>
  --<%= key %>: <%= light[key] %>;
  <% }) %>
}

.dark {
  --background: <%= dark.background %>;
  --foreground: <%= dark.foreground %>;
  --card: <%= dark.card %>;
  --card-foreground: <%= dark['card-foreground'] %>;
  --popover: <%= dark.popover %>;
  --popover-foreground: <%= dark['popover-foreground'] %>;
  --primary: <%= dark.primary %>;
  --primary-foreground: <%= dark['primary-foreground'] %>;
  --secondary: <%= dark.secondary %>;
  --secondary-foreground: <%= dark['secondary-foreground'] %>;
  --muted: <%= dark.muted %>;
  --muted-foreground: <%= dark['muted-foreground'] %>;
  --accent: <%= dark.accent %>;
  --accent-foreground: <%= dark['accent-foreground'] %>;
  --destructive: <%= dark.destructive %>;
  --destructive-foreground: <%= dark['destructive-foreground'] %>;
  --border: <%= dark.border %>;
  --input: <%= dark.input %>;
  --ring: <%= dark.ring %>;

  <% Object.keys(dark).filter(key => key.startsWith('chart')).forEach(key => { %>
  --<%= key %>: <%= dark[key] %>;
  <% }) %>
}

@theme inline {
  <% Object.keys(light).forEach(key => { %>
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

export const THEME_STYLES_WITH_VARIABLES = `
.theme-<%- theme %> {
  --background: <%- colors.light["background"] %>;
  --foreground: <%- colors.light["foreground"] %>;

  --muted: <%- colors.light["muted"] %>;
  --muted-foreground: <%- colors.light["muted-foreground"] %>;

  --popover: <%- colors.light["popover"] %>;
  --popover-foreground: <%- colors.light["popover-foreground"] %>;

  --card: <%- colors.light["card"] %>;
  --card-foreground: <%- colors.light["card-foreground"] %>;

  --border: <%- colors.light["border"] %>;
  --input: <%- colors.light["input"] %>;

  --primary: <%- colors.light["primary"] %>;
  --primary-foreground: <%- colors.light["primary-foreground"] %>;

  --secondary: <%- colors.light["secondary"] %>;
  --secondary-foreground: <%- colors.light["secondary-foreground"] %>;

  --accent: <%- colors.light["accent"] %>;
  --accent-foreground: <%- colors.light["accent-foreground"] %>;

  --destructive: <%- colors.light["destructive"] %>;
  --destructive-foreground: <%- colors.light["destructive-foreground"] %>;

  --ring: <%- colors.light["ring"] %>;

  --radius: <%- colors.light["radius"] %>;
}

.dark .theme-<%- theme %> {
  --background: <%- colors.dark["background"] %>;
  --foreground: <%- colors.dark["foreground"] %>;

  --muted: <%- colors.dark["muted"] %>;
  --muted-foreground: <%- colors.dark["muted-foreground"] %>;

  --popover: <%- colors.dark["popover"] %>;
  --popover-foreground: <%- colors.dark["popover-foreground"] %>;

  --card: <%- colors.dark["card"] %>;
  --card-foreground: <%- colors.dark["card-foreground"] %>;

  --border: <%- colors.dark["border"] %>;
  --input: <%- colors.dark["input"] %>;

  --primary: <%- colors.dark["primary"] %>;
  --primary-foreground: <%- colors.dark["primary-foreground"] %>;

  --secondary: <%- colors.dark["secondary"] %>;
  --secondary-foreground: <%- colors.dark["secondary-foreground"] %>;

  --accent: <%- colors.dark["accent"] %>;
  --accent-foreground: <%- colors.dark["accent-foreground"] %>;

  --destructive: <%- colors.dark["destructive"] %>;
  --destructive-foreground: <%- colors.dark["destructive-foreground"] %>;

  --ring: <%- colors.dark["ring"] %>;
}`
