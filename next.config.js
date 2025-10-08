/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // ⭐ CLAVE para Firebase App Hosting
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'flags.fmcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      // Agregar tus dominios de Firebase
      {
        protocol: 'https',
        hostname: 'forgeitedrenzy.online',
      },
      {
        protocol: 'https',
        hostname: 'studio--ark-evac.us-central1.hosted.app',
      }
    ],
  },
};

export default nextConfig;
