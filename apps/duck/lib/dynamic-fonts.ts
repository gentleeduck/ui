// Inter and Inria Serif are loaded on first selection; JetBrains Mono ships in initial HTML.

type FontFamilyKey = 'sans' | 'serif'

const loaded = new Set<FontFamilyKey>()

const FAMILIES: Record<FontFamilyKey, { family: string; faces: string }> = {
  // Inter only ships Regular/Medium/Bold; remap 100-400 -> Regular, 500-600 -> Medium, 700-900 -> Bold.
  sans: {
    family: '"Inter", ui-sans-serif, system-ui, sans-serif',
    faces: `
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 100 400;
        font-display: swap;
        src: url('/fonts/inter/inter-latin-ext-400-normal.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500 600;
        font-display: swap;
        src: url('/fonts/inter/inter-latin-ext-500-normal.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 700 900;
        font-display: swap;
        src: url('/fonts/inter/inter-latin-ext-700-normal.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: italic;
        font-weight: 100 400;
        font-display: swap;
        src: url('/fonts/inter/inter-latin-ext-400-italic.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: italic;
        font-weight: 500 600;
        font-display: swap;
        src: url('/fonts/inter/inter-latin-ext-500-italic.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: italic;
        font-weight: 700 900;
        font-display: swap;
        src: url('/fonts/inter/inter-latin-ext-700-italic.woff2') format('woff2');
      }
    `,
  },
  // Inria Serif ships Light/Regular/Bold; 100-300 -> Light, 400-500 -> Regular, 600-900 -> Bold.
  serif: {
    family: '"Inria Serif", Georgia, "Times New Roman", serif',
    faces: `
      @font-face {
        font-family: 'Inria Serif';
        font-style: normal;
        font-weight: 100 300;
        font-display: swap;
        src: url('/fonts/inria-serif/InriaSerif-Light.ttf') format('truetype');
      }
      @font-face {
        font-family: 'Inria Serif';
        font-style: normal;
        font-weight: 400 500;
        font-display: swap;
        src: url('/fonts/inria-serif/InriaSerif-Regular.ttf') format('truetype');
      }
      @font-face {
        font-family: 'Inria Serif';
        font-style: normal;
        font-weight: 600 900;
        font-display: swap;
        src: url('/fonts/inria-serif/InriaSerif-Bold.ttf') format('truetype');
      }
      @font-face {
        font-family: 'Inria Serif';
        font-style: italic;
        font-weight: 100 300;
        font-display: swap;
        src: url('/fonts/inria-serif/InriaSerif-LightItalic.ttf') format('truetype');
      }
      @font-face {
        font-family: 'Inria Serif';
        font-style: italic;
        font-weight: 400 500;
        font-display: swap;
        src: url('/fonts/inria-serif/InriaSerif-Italic.ttf') format('truetype');
      }
      @font-face {
        font-family: 'Inria Serif';
        font-style: italic;
        font-weight: 600 900;
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
