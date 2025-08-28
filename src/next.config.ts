
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    allowedDevOrigins: [
      "https://3000-firebase-studio-1749733304536.cluster-l6vkdperq5ebaqo3qy4ksvoqom.cloudworkstations.dev",
      "https://6000-firebase-studio-1749733304536.cluster-l6vkdperq5ebaqo3qy4ksvoqom.cloudworkstations.dev"
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
    ],
  },
};

export default nextConfig;

    