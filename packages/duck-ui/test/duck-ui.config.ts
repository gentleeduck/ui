export const config = {
  $schema: 'https://duckui.vercel.app/schema.json',
  rsc: false,
  tsx: true,
  style: 'default',
  tailwind: {
    config: 'tailwind.config.ts',
    baseColor: 'zinc',
    css: 'style.css',
    cssVariables: true,
    prefix: ''
  },
  aliases: {
    utils: '@/lib/utils',
    components: '@/components'
  }
}
