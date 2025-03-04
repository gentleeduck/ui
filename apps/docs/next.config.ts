// import type { NextConfig } from 'next'
// import { withContentlayer } from 'next-contentlayer2'
//
// const nextConfig: NextConfig = {
//   transpilePackages: [
//     '@duck/registry-ui-duckui',
//     '@duck/registry-examples-duckui',
//   ],
// }
//
// module.exports = withContentlayer(nextConfig)

// next.config.js
import { withContentlayer } from 'next-contentlayer'

const nextConfig = { reactStrictMode: true, swcMinify: true }

module.exports = withContentlayer(nextConfig)
