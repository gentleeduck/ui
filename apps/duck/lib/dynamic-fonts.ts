// Dynamic font loaders. Only the default JetBrains Mono Nerd ships with
// the initial HTML; Inter and Inria Serif are registered + downloaded on
// demand the first time the user picks them in the FontStyle menu.

type FontFamilyKey = 'sans' | 'serif'

const loaded = new Set<FontFamilyKey>()

const FAMILIES: Record<FontFamilyKey, { family: string; faces: string }> = {
  sans: {
    family: '"Inter", ui-sans-serif, system-ui, sans-serif',
    faces: `
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('/fonts/inter/inter-latin-ext-400-normal.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-display: swap;
        src: url('/fonts/inter/inter-latin-ext-500-normal.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url('/fonts/inter/inter-latin-ext-700-normal.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: italic;
        font-weight: 400;
        font-display: swap;
        src: url('/fonts/inter/inter-latin-ext-400-italic.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: italic;
        font-weight: 500;
        font-display: swap;
        src: url('/fonts/inter/inter-latin-ext-500-italic.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: italic;
        font-weight: 700;
        font-display: swap;
        src: url('/fonts/inter/inter-latin-ext-700-italic.woff2') format('woff2');
      }
    `,
  },
  serif: {
    family: '"Inria Serif", Georgia, "Times New Roman", serif',
    faces: `
      @font-face {
        font-family: 'Inria Serif';
        font-style: normal;
        font-weight: 300;
        font-display: swap;
        src: url('/fonts/inria-serif/InriaSerif-Light.ttf') format('truetype');
      }
      @font-face {
        font-family: 'Inria Serif';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('/fonts/inria-serif/InriaSerif-Regular.ttf') format('truetype');
      }
      @font-face {
        font-family: 'Inria Serif';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url('/fonts/inria-serif/InriaSerif-Bold.ttf') format('truetype');
      }
      @font-face {
        font-family: 'Inria Serif';
        font-style: italic;
        font-weight: 300;
        font-display: swap;
        src: url('/fonts/inria-serif/InriaSerif-LightItalic.ttf') format('truetype');
      }
      @font-face {
        font-family: 'Inria Serif';
        font-style: italic;
        font-weight: 400;
        font-display: swap;
        src: url('/fonts/inria-serif/InriaSerif-Italic.ttf') format('truetype');
      }
      @font-face {
        font-family: 'Inria Serif';
        font-style: italic;
        font-weight: 700;
        font-display: swap;
        src: url('/fonts/inria-serif/InriaSerif-BoldItalic.ttf') format('truetype');
      }
    `,
  },
}

export function loadDynamicFont(key: FontFamilyKey): string {
  if (typeof document !== 'undefined' && !loaded.has(key)) {
    loaded.add(key)
    const style = document.createElement('style')
    style.dataset.dynamicFont = key
    style.textContent = FAMILIES[key].faces
    document.head.appendChild(style)
  }
  return FAMILIES[key].family
}
