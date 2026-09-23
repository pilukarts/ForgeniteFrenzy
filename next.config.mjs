/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig = {
  output: process.env.GITHUB_ACTIONS === 'true' ? 'export' : undefined,
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: process.env.GITHUB_ACTIONS === 'true',
  },
  transpilePackages: [
    '@rainbow-me/rainbowkit',
    '@wagmi/core',
    'wagmi',
  ],
};

export default nextConfig;
