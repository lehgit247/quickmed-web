/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force all pages to be dynamic (no static generation)
  output: 'standalone',
  
  // Disable static optimization completely
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  
  // Disable static generation for all routes
  generateStaticParams: () => {
    return {};
  },
  
  // Important: Disable static rendering
  staticPageGenerationTimeout: 0,
  
  // Ensure no pages are pre-rendered
  swcMinify: true,
  
  // Add transpile for Agora
  transpilePackages: ['agora-rtc-react', 'agora-rtc-sdk-ng'],
}

module.exports = nextConfig