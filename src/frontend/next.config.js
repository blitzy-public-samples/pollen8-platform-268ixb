/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React's Strict Mode for improved development-time warnings and checks
  reactStrictMode: true,

  // Configure Next.js Image Optimization feature
  images: {
    domains: ['s3.amazonaws.com'],
  },

  // Expose environment variables to the browser
  env: {
    API_URL: process.env.API_URL,
  },

  // Custom webpack configurations
  webpack: (config, { isServer }) => {
    // Add custom webpack configurations here
    // This can be used for optimizing bundle size or adding custom loaders

    // Example: Add a custom loader for SVG files
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Optimize bundle size
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      };
    }

    return config;
  },

  // Set custom HTTP headers for improved security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.pollen8.com;",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Configure URL redirects
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
      // Add more redirects as needed
    ];
  },

  // Additional Next.js configurations
  poweredByHeader: false, // Remove X-Powered-By header
  compress: true, // Enable gzip compression
  generateEtags: true, // Generate ETags for caching
  pageExtensions: ['tsx', 'ts'], // Only allow TypeScript files for pages

  // Configure the build output
  distDir: 'build',

  // Configure TypeScript compilation
  typescript: {
    ignoreBuildErrors: false, // Enforce TypeScript checks during build
  },

  // Configure Sass options (if using Sass)
  sassOptions: {
    includePaths: ['./src/styles'],
  },

  // Configure runtime configuration
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: 'secret',
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/static',
  },
};

module.exports = nextConfig;