
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com', 
        port: '',
        pathname: '/**',
      }
    ],
  },
  devServer: {
    allowedDevOrigins: [
        "https://*.cloudworkstations.dev",
    ]
  }
};

export default nextConfig;
