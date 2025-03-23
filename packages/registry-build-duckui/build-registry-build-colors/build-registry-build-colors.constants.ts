export const BASE_STYLES_WITH_VARIABLES = `@import "tailwindcss";
@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));

:root {
  --background: <%= cssVars.light.background %>;
  --foreground: <%= cssVars.light.foreground %>;
  --card: <%= cssVars.light.card %>;
  --card-foreground: <%= cssVars.light['card-foreground'] %>;
  --popover: <%= cssVars.light.popover %>;
  --popover-foreground: <%= cssVars.light['popover-foreground'] %>;
  --primary: <%= cssVars.light.primary %>;
  --primary-foreground: <%= cssVars.light['primary-foreground'] %>;
  --secondary: <%= cssVars.light.secondary %>;
  --secondary-foreground: <%= cssVars.light['secondary-foreground'] %>;
  --muted: <%= cssVars.light.muted %>;
  --muted-foreground: <%= cssVars.light['muted-foreground'] %>;
  --accent: <%= cssVars.light.accent %>;
  --accent-foreground: <%= cssVars.light['accent-foreground'] %>;
  --destructive: <%= cssVars.light.destructive %>;
  --destructive-foreground: <%= cssVars.light['destructive-foreground'] %>;
  --chart-1: <%= cssVars.light['chart-1'] %>;
  --chart-2: <%= cssVars.light['chart-2'] %>;
  --chart-3: <%= cssVars.light['chart-3'] %>;
  --chart-4: <%= cssVars.light['chart-4'] %>;
  --chart-5: <%= cssVars.light['chart-5'] %>;
  --border: <%= cssVars.light.border %>;
  --input: <%= cssVars.light.input %>;
  --ring: <%= cssVars.light.ring %>;
  --radius: <%= cssVars.light.radius %>;
}

.dark {
  --background: <%= cssVars.dark.background %>;
  --foreground: <%= cssVars.dark.foreground %>;
  --card: <%= cssVars.dark.card %>;
  --card-foreground: <%= cssVars.dark['card-foreground'] %>;
  --popover: <%= cssVars.dark.popover %>;
  --popover-foreground: <%= cssVars.dark['popover-foreground'] %>;
  --primary: <%= cssVars.dark.primary %>;
  --primary-foreground: <%= cssVars.dark['primary-foreground'] %>;
  --secondary: <%= cssVars.dark.secondary %>;
  --secondary-foreground: <%= cssVars.dark['secondary-foreground'] %>;
  --muted: <%= cssVars.dark.muted %>;
  --muted-foreground: <%= cssVars.dark['muted-foreground'] %>;
  --accent: <%= cssVars.dark.accent %>;
  --accent-foreground: <%= cssVars.dark['accent-foreground'] %>;
  --destructive: <%= cssVars.dark.destructive %>;
  --destructive-foreground: <%= cssVars.dark['destructive-foreground'] %>;
  --chart-1: <%= cssVars.dark['chart-1'] %>;
  --chart-2: <%= cssVars.dark['chart-2'] %>;
  --chart-3: <%= cssVars.dark['chart-3'] %>;
  --chart-4: <%= cssVars.dark['chart-4'] %>;
  --chart-5: <%= cssVars.dark['chart-5'] %>;
  --border: <%= cssVars.dark.border %>;
  --input: <%= cssVars.dark.input %>;
  --ring: <%= cssVars.dark.ring %>;
  --radius: <%= cssVars.dark.radius %>;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-radius: var(--radius);
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
