/** @type {import('next').NextConfig} */
const nextConfig = {
  // For server components
  serverExternalPackages: ['mongoose'],
  
  // For Turbopack
  swcMinify: true,
  
  // Disable static optimization for problematic pages
  experimental: {
    // Optional: Enable if you need server actions
    // serverActions: true,
  },
  
  // Transpile Agora packages
  transpilePackages: ['agora-rtc-react', 'agora-rtc-sdk-ng'],
}

export default nextConfig;