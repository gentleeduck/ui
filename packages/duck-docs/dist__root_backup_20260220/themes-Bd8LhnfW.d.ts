//#region src/lib/themes.d.ts
declare const THEMES: ({
  cssVars: {
    dark: Record<string, string>;
    light: Record<string, string>;
  };
  colors: {
    readonly accent: "240 4.8% 95.9%";
    readonly 'accent-foreground': "240 5.9% 10%";
    readonly background: "0 0% 100%";
    readonly border: "240 5.9% 90%";
    readonly card: "0 0% 100%";
    readonly 'card-foreground': "240 10% 3.9%";
    readonly 'chart-1': "173 58% 39%";
    readonly 'chart-2': "12 76% 61%";
    readonly 'chart-3': "197 37% 24%";
    readonly 'chart-4': "43 74% 66%";
    readonly 'chart-5': "27 87% 67%";
    readonly destructive: "0 84.2% 60.2%";
    readonly 'destructive-foreground': "0 0% 98%";
    readonly foreground: "240 10% 3.9%";
    readonly input: "240 5.9% 90%";
    readonly muted: "240 4.8% 95.9%";
    readonly 'muted-foreground': "240 3.8% 46.1%";
    readonly popover: "0 0% 100%";
    readonly 'popover-foreground': "240 10% 3.9%";
    readonly primary: "240 5.9% 10%";
    readonly 'primary-foreground': "0 0% 98%";
    readonly ring: "240 10% 3.9%";
    readonly secondary: "240 4.8% 95.9%";
    readonly 'secondary-foreground': "240 5.9% 10%";
  };
  colorsDark: {
    readonly accent: "240 3.7% 15.9%";
    readonly 'accent-foreground': "0 0% 98%";
    readonly background: "240 10% 3.9%";
    readonly border: "240 3.7% 15.9%";
    readonly card: "240 10% 3.9%";
    readonly 'card-foreground': "0 0% 98%";
    readonly 'chart-1': "220 70% 50%";
    readonly 'chart-2': "340 75% 55%";
    readonly 'chart-3': "30 80% 55%";
    readonly 'chart-4': "280 65% 60%";
    readonly 'chart-5': "160 60% 45%";
    readonly destructive: "0 62.8% 30.6%";
    readonly 'destructive-foreground': "0 0% 98%";
    readonly foreground: "0 0% 98%";
    readonly input: "240 3.7% 15.9%";
    readonly muted: "240 3.7% 15.9%";
    readonly 'muted-foreground': "240 5% 64.9%";
    readonly popover: "240 10% 3.9%";
    readonly 'popover-foreground': "0 0% 98%";
    readonly primary: "0 0% 98%";
    readonly 'primary-foreground': "240 5.9% 10%";
    readonly ring: "240 4.9% 83.9%";
    readonly secondary: "240 3.7% 15.9%";
    readonly 'secondary-foreground': "0 0% 98%";
  };
  fontFamily: {
    readonly body: {
      readonly name: "Inter";
      readonly type: "sans-serif";
    };
    readonly heading: {
      readonly name: "Inter";
      readonly type: "sans-serif";
    };
  };
  id: "default-duckui";
  name: "Default";
  radius: 0.5;
} | {
  cssVars: {
    dark: Record<string, string>;
    light: Record<string, string>;
  };
  colors: {
    readonly accent: "240 4.8% 95.9%";
    readonly 'accent-foreground': "240 5.9% 10%";
    readonly background: "0 0% 100%";
    readonly border: "240 5.9% 90%";
    readonly card: "0 0% 100%";
    readonly 'card-foreground': "240 10% 3.9%";
    readonly 'chart-1': "12 76% 61%";
    readonly 'chart-2': "173 58% 39%";
    readonly 'chart-3': "197 37% 24%";
    readonly 'chart-4': "43 74% 66%";
    readonly 'chart-5': "27 87% 67%";
    readonly destructive: "0 84.2% 60.2%";
    readonly 'destructive-foreground': "0 0% 98%";
    readonly foreground: "240 10% 3.9%";
    readonly input: "240 5.9% 90%";
    readonly muted: "240 4.8% 95.9%";
    readonly 'muted-foreground': "240 3.8% 46.1%";
    readonly popover: "0 0% 100%";
    readonly 'popover-foreground': "240 10% 3.9%";
    readonly primary: "240 5.9% 10%";
    readonly 'primary-foreground': "0 0% 98%";
    readonly ring: "240 10% 3.9%";
    readonly secondary: "240 4.8% 95.9%";
    readonly 'secondary-foreground': "240 5.9% 10%";
  };
  colorsDark: {
    readonly accent: "240 3.7% 15.9%";
    readonly 'accent-foreground': "0 0% 98%";
    readonly background: "240 10% 3.9%";
    readonly border: "240 3.7% 15.9%";
    readonly card: "240 10% 3.9%";
    readonly 'card-foreground': "0 0% 98%";
    readonly 'chart-1': "220 70% 50%";
    readonly 'chart-2': "160 60% 45%";
    readonly 'chart-3': "30 80% 55%";
    readonly 'chart-4': "280 65% 60%";
    readonly 'chart-5': "340 75% 55%";
    readonly destructive: "0 62.8% 30.6%";
    readonly 'destructive-foreground': "0 0% 98%";
    readonly foreground: "0 0% 98%";
    readonly input: "240 3.7% 15.9%";
    readonly muted: "240 3.7% 15.9%";
    readonly 'muted-foreground': "240 5% 64.9%";
    readonly popover: "240 10% 3.9%";
    readonly 'popover-foreground': "0 0% 98%";
    readonly primary: "0 0% 98%";
    readonly 'primary-foreground': "240 5.9% 10%";
    readonly ring: "240 4.9% 83.9%";
    readonly secondary: "240 3.7% 15.9%";
    readonly 'secondary-foreground': "0 0% 98%";
  };
  fontFamily: {
    readonly body: {
      readonly name: "Inter";
      readonly type: "sans-serif";
    };
    readonly heading: {
      readonly name: "Inter";
      readonly type: "sans-serif";
    };
  };
  id: "default-palette";
  name: "Palette";
  radius: 0.5;
} | {
  cssVars: {
    dark: Record<string, string>;
    light: Record<string, string>;
  };
  colors: {
    readonly accent: "210 40% 96.1%";
    readonly accentForeground: "222.2 47.4% 11.2%";
    readonly background: "0 0% 100%";
    readonly border: "214.3 31.8% 91.4%";
    readonly card: "0 0% 100%";
    readonly cardForeground: "222.2 84% 4.9%";
    readonly 'chart-1': "221.2 83.2% 53.3%";
    readonly 'chart-2': "212 95% 68%";
    readonly 'chart-3': "216 92% 60%";
    readonly 'chart-4': "210 98% 78%";
    readonly 'chart-5': "212 97% 87%";
    readonly destructive: "0 72% 51%";
    readonly destructiveForeground: "210 40% 98%";
    readonly foreground: "222.2 84% 4.9%";
    readonly input: "214.3 31.8% 91.4%";
    readonly muted: "210 40% 96.1%";
    readonly mutedForeground: "215.4 16.3% 44%";
    readonly popover: "0 0% 100%";
    readonly popoverForeground: "222.2 84% 4.9%";
    readonly primary: "221.2 83.2% 53.3%";
    readonly primaryForeground: "210 40% 98%";
    readonly ring: "221.2 83.2% 53.3%";
    readonly secondary: "210 40% 96.1%";
    readonly secondaryForeground: "222.2 47.4% 11.2%";
  };
  colorsDark: {
    readonly accent: "240 3.7% 15.9%";
    readonly 'accent-foreground': "0 0% 98%";
    readonly background: "240 10% 3.9%";
    readonly border: "240 3.7% 15.9%";
    readonly card: "240 10% 3.9%";
    readonly 'card-foreground': "0 0% 98%";
    readonly 'chart-1': "221.2 83.2% 53.3%";
    readonly 'chart-2': "212 95% 68%";
    readonly 'chart-3': "216 92% 60%";
    readonly 'chart-4': "210 98% 78%";
    readonly 'chart-5': "212 97% 87%";
    readonly destructive: "0 72% 51%";
    readonly destructiveForeground: "210 40% 98%";
    readonly foreground: "0 0% 98%";
    readonly input: "240 3.7% 15.9%";
    readonly muted: "240 3.7% 15.9%";
    readonly 'muted-foreground': "240 5% 64.9%";
    readonly popover: "240 10% 3.9%";
    readonly 'popover-foreground': "0 0% 98%";
    readonly primary: "221.2 83.2% 53.3%";
    readonly primaryForeground: "210 40% 98%";
    readonly ring: "221.2 83.2% 53.3%";
    readonly secondary: "210 40% 96.1%";
    readonly secondaryForeground: "222.2 47.4% 11.2%";
  };
  fontFamily: {
    readonly body: {
      readonly name: "Inter";
      readonly type: "sans-serif";
    };
    readonly heading: {
      readonly name: "Inter";
      readonly type: "sans-serif";
    };
  };
  id: "default-sapphire";
  name: "Sapphire";
  radius: 0.5;
} | {
  cssVars: {
    dark: Record<string, string>;
    light: Record<string, string>;
  };
  colors: {
    readonly accent: "240 4.8% 95.9%";
    readonly accentForeground: "240 5.9% 10%";
    readonly background: "0 0% 100%";
    readonly border: "240 5.9% 90%";
    readonly card: "0 0% 100%";
    readonly cardForeground: "240 10% 3.9%";
    readonly 'chart-1': "347 77% 50%";
    readonly 'chart-2': "352 83% 91%";
    readonly 'chart-3': "350 80% 72%";
    readonly 'chart-4': "351 83% 82%";
    readonly 'chart-5': "349 77% 62%";
    readonly destructive: "0 72% 51%";
    readonly destructiveForeground: "0 0% 98%";
    readonly foreground: "240 10% 3.9%";
    readonly input: "240 5.9% 90%";
    readonly muted: "240 4.8% 95.9%";
    readonly mutedForeground: "240 3.8% 45%";
    readonly popover: "0 0% 100%";
    readonly popoverForeground: "240 10% 3.9%";
    readonly primary: "346.8 77.2% 49.8%";
    readonly primaryForeground: "355.7 100% 99%";
    readonly ring: "346.8 77.2% 49.8%";
    readonly secondary: "240 4.8% 95.9%";
    readonly secondaryForeground: "240 5.9% 10%";
  };
  colorsDark: {
    readonly accent: "240 3.7% 15.9%";
    readonly 'accent-foreground': "0 0% 98%";
    readonly background: "240 10% 3.9%";
    readonly border: "240 3.7% 15.9%";
    readonly card: "240 10% 3.9%";
    readonly 'card-foreground': "0 0% 98%";
    readonly 'chart-1': "347 77% 50%";
    readonly 'chart-2': "349 77% 62%";
    readonly 'chart-3': "350 80% 72%";
    readonly 'chart-4': "351 83% 82%";
    readonly 'chart-5': "352 83% 91%";
    readonly destructive: "0 72% 51%";
    readonly destructiveForeground: "0 0% 98%";
    readonly foreground: "0 0% 98%";
    readonly input: "240 3.7% 15.9%";
    readonly muted: "240 3.7% 15.9%";
    readonly 'muted-foreground': "240 5% 64.9%";
    readonly popover: "240 10% 3.9%";
    readonly 'popover-foreground': "0 0% 98%";
    readonly primary: "346.8 77.2% 49.8%";
    readonly primaryForeground: "355.7 100% 99%";
    readonly ring: "221.2 83.2% 53.3%";
    readonly secondary: "240 4.8% 95.9%";
    readonly secondaryForeground: "240 5.9% 10%";
  };
  fontFamily: {
    readonly body: {
      readonly name: "Inter";
      readonly type: "sans-serif";
    };
    readonly heading: {
      readonly name: "Inter";
      readonly type: "sans-serif";
    };
  };
  id: "default-ruby";
  name: "Ruby";
  radius: 0.5;
} | {
  cssVars: {
    dark: Record<string, string>;
    light: Record<string, string>;
  };
  colors: {
    readonly accent: "240 4.8% 95.9%";
    readonly accentForeground: "240 5.9% 10%";
    readonly background: "0 0% 100%";
    readonly border: "240 5.9% 90%";
    readonly card: "0 0% 100%";
    readonly cardForeground: "240 10% 3.9%";
    readonly 'chart-1': "139 65% 20%";
    readonly 'chart-2': "140 74% 44%";
    readonly 'chart-3': "142 88% 28%";
    readonly 'chart-4': "137 55% 15%";
    readonly 'chart-5': "141 40% 9%";
    readonly destructive: "0 72% 51%";
    readonly destructiveForeground: "0 0% 98%";
    readonly foreground: "240 10% 3.9%";
    readonly input: "240 5.9% 90%";
    readonly muted: "240 4.8% 95.9%";
    readonly mutedForeground: "240 3.8% 45%";
    readonly popover: "0 0% 100%";
    readonly popoverForeground: "240 10% 3.9%";
    readonly primary: "142 86% 28%";
    readonly primaryForeground: "356 29% 98%";
    readonly ring: "142 86% 28%";
    readonly secondary: "240 4.8% 95.9%";
    readonly secondaryForeground: "240 5.9% 10%";
  };
  colorsDark: {
    readonly accent: "240 3.7% 15.9%";
    readonly 'accent-foreground': "0 0% 98%";
    readonly background: "240 10% 3.9%";
    readonly border: "240 3.7% 15.9%";
    readonly card: "240 10% 3.9%";
    readonly 'card-foreground': "0 0% 98%";
    readonly 'chart-1': "142 88% 28%";
    readonly 'chart-2': "139 65% 20%";
    readonly 'chart-3': "140 74% 24%";
    readonly 'chart-4': "137 55% 15%";
    readonly 'chart-5': "141 40% 9%";
    readonly destructive: "0 72% 51%";
    readonly destructiveForeground: "0 0% 98%";
    readonly foreground: "0 0% 98%";
    readonly input: "240 3.7% 15.9%";
    readonly muted: "240 3.7% 15.9%";
    readonly 'muted-foreground': "240 5% 64.9%";
    readonly popover: "240 10% 3.9%";
    readonly 'popover-foreground': "0 0% 98%";
    readonly primary: "142 86% 28%";
    readonly primaryForeground: "356 29% 98%";
    readonly ring: "142 86% 28%";
    readonly secondary: "240 4.8% 95.9%";
    readonly secondaryForeground: "240 5.9% 10%";
  };
  fontFamily: {
    readonly body: {
      readonly name: "Inter";
      readonly type: "sans-serif";
    };
    readonly heading: {
      readonly name: "Inter";
      readonly type: "sans-serif";
    };
  };
  id: "default-emerald";
  name: "Emerald";
  radius: 0.5;
} | {
  cssVars: {
    dark: Record<string, string>;
    light: Record<string, string>;
  };
  colors: {
    readonly accent: "36 64% 57%";
    readonly accentForeground: "36 72% 17%";
    readonly background: "36 39% 88%";
    readonly border: "36 45% 60%";
    readonly card: "36 46% 82%";
    readonly cardForeground: "36 45% 20%";
    readonly 'chart-1': "25 34% 28%";
    readonly 'chart-2': "26 36% 34%";
    readonly 'chart-3': "28 40% 40%";
    readonly 'chart-4': "31 41% 48%";
    readonly 'chart-5': "35 43% 53%";
    readonly destructive: "0 84% 37%";
    readonly destructiveForeground: "0 0% 98%";
    readonly foreground: "36 45% 15%";
    readonly input: "36 45% 60%";
    readonly muted: "36 33% 75%";
    readonly mutedForeground: "36 45% 25%";
    readonly popover: "0 0% 100%";
    readonly popoverForeground: "240 10% 3.9%";
    readonly primary: "36 45% 70%";
    readonly primaryForeground: "36 45% 11%";
    readonly ring: "36 45% 30%";
    readonly secondary: "40 35% 77%";
    readonly secondaryForeground: "36 45% 25%";
  };
  colorsDark: {
    readonly accent: "36 64% 57%";
    readonly accentForeground: "36 72% 17%";
    readonly background: "36 39% 88%";
    readonly border: "36 45% 60%";
    readonly card: "36 46% 82%";
    readonly cardForeground: "36 45% 20%";
    readonly 'chart-1': "25 34% 28%";
    readonly 'chart-2': "26 36% 34%";
    readonly 'chart-3': "28 40% 40%";
    readonly 'chart-4': "31 41% 48%";
    readonly 'chart-5': "35 43% 53%";
    readonly destructive: "0 84% 37%";
    readonly destructiveForeground: "0 0% 98%";
    readonly foreground: "36 45% 15%";
    readonly input: "36 45% 60%";
    readonly muted: "36 33% 75%";
    readonly mutedForeground: "36 45% 25%";
    readonly popover: "0 0% 100%";
    readonly popoverForeground: "240 10% 3.9%";
    readonly primary: "36 45% 70%";
    readonly primaryForeground: "36 45% 11%";
    readonly ring: "36 45% 30%";
    readonly secondary: "40 35% 77%";
    readonly secondaryForeground: "36 45% 25%";
  };
  fontFamily: {
    readonly body: {
      readonly name: "Space Mono";
      readonly type: "monospace";
    };
    readonly heading: {
      readonly name: "DM Sans";
      readonly type: "sans-serif";
    };
  };
  id: "default-daylight";
  name: "Daylight";
} | {
  cssVars: {
    dark: Record<string, string>;
    light: Record<string, string>;
  };
  colors: {
    readonly accent: "240 0% 13%";
    readonly accentForeground: "60 0% 100%";
    readonly background: "240 5% 6%";
    readonly border: "240 6% 20%";
    readonly card: "240 4% 10%";
    readonly cardForeground: "60 5% 90%";
    readonly 'chart-1': "359 2% 90%";
    readonly 'chart-2': "240 1% 74%";
    readonly 'chart-3': "240 1% 58%";
    readonly 'chart-4': "240 1% 42%";
    readonly 'chart-5': "240 2% 26%";
    readonly destructive: "0 60% 50%";
    readonly destructiveForeground: "0 0% 98%";
    readonly foreground: "60 5% 90%";
    readonly input: "240 6% 20%";
    readonly muted: "240 5% 25%";
    readonly mutedForeground: "60 5% 85%";
    readonly popover: "240 5% 15%";
    readonly popoverForeground: "60 5% 85%";
    readonly primary: "240 0% 90%";
    readonly primaryForeground: "60 0% 0%";
    readonly ring: "240 5% 90%";
    readonly secondary: "240 4% 15%";
    readonly secondaryForeground: "60 5% 85%";
  };
  colorsDark: {
    readonly accent: "240 0% 13%";
    readonly accentForeground: "60 0% 100%";
    readonly background: "240 5% 6%";
    readonly border: "240 6% 20%";
    readonly card: "240 4% 10%";
    readonly cardForeground: "60 5% 90%";
    readonly 'chart-1': "359 2% 90%";
    readonly 'chart-2': "240 1% 74%";
    readonly 'chart-3': "240 1% 58%";
    readonly 'chart-4': "240 1% 42%";
    readonly 'chart-5': "240 2% 26%";
    readonly destructive: "0 60% 50%";
    readonly destructiveForeground: "0 0% 98%";
    readonly foreground: "60 5% 90%";
    readonly input: "240 6% 20%";
    readonly muted: "240 5% 25%";
    readonly mutedForeground: "60 5% 85%";
    readonly popover: "240 5% 15%";
    readonly popoverForeground: "60 5% 85%";
    readonly primary: "240 0% 90%";
    readonly primaryForeground: "60 0% 0%";
    readonly ring: "240 5% 90%";
    readonly secondary: "240 4% 15%";
    readonly secondaryForeground: "60 5% 85%";
  };
  fontFamily: {
    readonly body: {
      readonly name: "Manrope";
      readonly type: "sans-serif";
    };
    readonly heading: {
      readonly name: "Manrope";
      readonly type: "sans-serif";
    };
  };
  id: "default-midnight";
  name: "Midnight";
  radius: 0.5;
})[];
type Theme = (typeof THEMES)[number];
//#endregion
export { Theme as n, THEMES as t };
//# sourceMappingURL=themes-Bd8LhnfW.d.ts.map