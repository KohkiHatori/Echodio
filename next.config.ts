/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.theapi.app', 'lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
