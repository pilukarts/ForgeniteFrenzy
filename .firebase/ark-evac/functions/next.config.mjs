// next.config.mjs
var nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co"
      },
      {
        protocol: "https",
        hostname: "i.imgur.com"
      },
      {
        protocol: "https",
        hostname: "flags.fmcdn.net"
      },
      {
        protocol: "https",
        hostname: "picsum.photos"
      }
    ]
  }
};
var next_config_default = nextConfig;
export {
  next_config_default as default
};
