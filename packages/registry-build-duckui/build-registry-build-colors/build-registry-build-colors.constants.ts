export const BASE_STYLES = `@tailwind base;
@tailwind components;
@tailwind utilities;
  `

export const BASE_STYLES_WITH_VARIABLES = `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: <%- colors.light["background"] %>;
    --foreground: <%- colors.light["foreground"] %>;
    --card: <%- colors.light["card"] %>;
    --card-foreground: <%- colors.light["card-foreground"] %>;
    --popover: <%- colors.light["popover"] %>;
    --popover-foreground: <%- colors.light["popover-foreground"] %>;
    --primary: <%- colors.light["primary"] %>;
    --primary-foreground: <%- colors.light["primary-foreground"] %>;
    --secondary: <%- colors.light["secondary"] %>;
    --secondary-foreground: <%- colors.light["secondary-foreground"] %>;
    --muted: <%- colors.light["muted"] %>;
    --muted-foreground: <%- colors.light["muted-foreground"] %>;
    --accent: <%- colors.light["accent"] %>;
    --accent-foreground: <%- colors.light["accent-foreground"] %>;
    --destructive: <%- colors.light["destructive"] %>;
    --destructive-foreground: <%- colors.light["destructive-foreground"] %>;
    --border: <%- colors.light["border"] %>;
    --input: <%- colors.light["input"] %>;
    --ring: <%- colors.light["ring"] %>;
    --radius: 0.5rem;
    --chart-1: <%- colors.light["chart-1"] %>;
    --chart-2: <%- colors.light["chart-2"] %>;
    --chart-3: <%- colors.light["chart-3"] %>;
    --chart-4: <%- colors.light["chart-4"] %>;
    --chart-5: <%- colors.light["chart-5"] %>;
  }

  .dark {
    --background: <%- colors.dark["background"] %>;
    --foreground: <%- colors.dark["foreground"] %>;
    --card: <%- colors.dark["card"] %>;
    --card-foreground: <%- colors.dark["card-foreground"] %>;
    --popover: <%- colors.dark["popover"] %>;
    --popover-foreground: <%- colors.dark["popover-foreground"] %>;
    --primary: <%- colors.dark["primary"] %>;
    --primary-foreground: <%- colors.dark["primary-foreground"] %>;
    --secondary: <%- colors.dark["secondary"] %>;
    --secondary-foreground: <%- colors.dark["secondary-foreground"] %>;
    --muted: <%- colors.dark["muted"] %>;
    --muted-foreground: <%- colors.dark["muted-foreground"] %>;
    --accent: <%- colors.dark["accent"] %>;
    --accent-foreground: <%- colors.dark["accent-foreground"] %>;
    --destructive: <%- colors.dark["destructive"] %>;
    --destructive-foreground: <%- colors.dark["destructive-foreground"] %>;
    --border: <%- colors.dark["border"] %>;
    --input: <%- colors.dark["input"] %>;
    --ring: <%- colors.dark["ring"] %>;
    --chart-1: <%- colors.dark["chart-1"] %>;
    --chart-2: <%- colors.dark["chart-2"] %>;
    --chart-3: <%- colors.dark["chart-3"] %>;
    --chart-4: <%- colors.dark["chart-4"] %>;
    --chart-5: <%- colors.dark["chart-5"] %>;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}`

export const THEME_STYLES_WITH_VARIABLES = `
.theme-<%- theme %> {
  --background: hsl(<%- colors.light["background"] %>);
  --foreground: hsl(<%- colors.light["foreground"] %>);

  --muted: hsl(<%- colors.light["muted"] %>);
  --muted-foreground: hsl(<%- colors.light["muted-foreground"] %>);

  --popover: hsl(<%- colors.light["popover"] %>);
  --popover-foreground: hsl(<%- colors.light["popover-foreground"] %>);

  --card: hsl(<%- colors.light["card"] %>);
  --card-foreground: hsl(<%- colors.light["card-foreground"] %>);

  --border: hsl(<%- colors.light["border"] %>);
  --input: hsl(<%- colors.light["input"] %>);

  --primary: hsl(<%- colors.light["primary"] %>);
  --primary-foreground: hsl(<%- colors.light["primary-foreground"] %>);

  --secondary: hsl(<%- colors.light["secondary"] %>);
  --secondary-foreground: hsl(<%- colors.light["secondary-foreground"] %>);

  --accent: hsl(<%- colors.light["accent"] %>);
  --accent-foreground: hsl(<%- colors.light["accent-foreground"] %>);

  --destructive: hsl(<%- colors.light["destructive"] %>);
  --destructive-foreground: hsl(<%- colors.light["destructive-foreground"] %>);

  --ring: hsl(<%- colors.light["ring"] %>);

  --radius: hsl(<%- colors.light["radius"] %>);
}

.dark .theme-<%- theme %> {
  --background: hsl(<%- colors.dark["background"] %>);
  --foreground: hsl(<%- colors.dark["foreground"] %>);

  --muted: hsl(<%- colors.dark["muted"] %>);
  --muted-foreground: hsl(<%- colors.dark["muted-foreground"] %>);

  --popover: hsl(<%- colors.dark["popover"] %>);
  --popover-foreground: hsl(<%- colors.dark["popover-foreground"] %>);

  --card: hsl(<%- colors.dark["card"] %>);
  --card-foreground: hsl(<%- colors.dark["card-foreground"] %>);

  --border: hsl(<%- colors.dark["border"] %>);
  --input: hsl(<%- colors.dark["input"] %>);

  --primary: hsl(<%- colors.dark["primary"] %>);
  --primary-foreground: hsl(<%- colors.dark["primary-foreground"] %>);

  --secondary: hsl(<%- colors.dark["secondary"] %>);
  --secondary-foreground: hsl(<%- colors.dark["secondary-foreground"] %>);

  --accent: hsl(<%- colors.dark["accent"] %>);
  --accent-foreground: hsl(<%- colors.dark["accent-foreground"] %>);

  --destructive: hsl(<%- colors.dark["destructive"] %>);
  --destructive-foreground: hsl(<%- colors.dark["destructive-foreground"] %>);

  --ring: hsl(<%- colors.dark["ring"] %>);
}`
