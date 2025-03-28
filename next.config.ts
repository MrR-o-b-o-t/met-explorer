/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.metmuseum.org',
      },
    ],
  },
  reactStrictMode: true,
  devIndicators: false,
}

module.exports = nextConfig