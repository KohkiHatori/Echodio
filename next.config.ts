import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['img.theapi.app', 'lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
  },
};

   module.exports = {
     eslint: {
       ignoreDuringBuilds: true,
     },
   };

export default nextConfig;
