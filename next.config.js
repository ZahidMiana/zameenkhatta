/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { 
    unoptimized: true,
    domains: ['localhost', 'zameenkhatta.com', 'www.zameenkhatta.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // Optimize for production
  swcMinify: true,
  poweredByHeader: false,
  compress: true,
  // Handle file uploads
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  // Redirect configurations
  async redirects() {
    return [
      {
        source: '/add-property',
        destination: '/dashboard/listings/new',
        permanent: true,
      },
    ]
  },
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
};

module.exports = nextConfig;
