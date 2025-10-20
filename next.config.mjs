/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'semver' on the client-side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        semver: false,
      };
    }
    return config;
  },
};

export default nextConfig;
