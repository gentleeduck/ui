export default {
  // name: 'duck-ui',
  // description: 'duck-ui',
  // version: '1.0.0'
  $schema: 'https://duckui.vercel.app/schema.json',
  style: 'default',
  rsc: false,
  tsx: true,
  tailwind: {
    config: 'tailwind.config.ts',
    css: './test/scss/style.scss',
    baseColor: 'zinc',
    cssVariables: true
  },
  aliases: {
    components: 'test/components',
    utils: 'test/utils'
  }
}
