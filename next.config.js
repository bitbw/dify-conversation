/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false, // enable browser source map generation during the production build
  // Configure pageExtensions to include md and mdx
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  experimental: {
    // appDir: true,
  },
  // fix all before production. Now it slow the develop speed.
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 在开发过程中忽略类型错误，但在构建时仍会检查
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/files/:path*',
  //       destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3300'}/:path*`,
  //     },
  //   ]
  // },
}

module.exports = nextConfig
