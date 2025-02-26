import { defineConfig } from 'vite'

import tailwindcss from '@tailwindcss/vite'
import autoprefixer from 'autoprefixer'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  // css: {
  //   // postcss: {
  //   //   plugins: [tailwindcss(), autoprefixer()],
  //   // },
  // },
  plugins: [react()],
})
