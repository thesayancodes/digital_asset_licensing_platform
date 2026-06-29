import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@creit-tech/stellar-wallets-kit'],
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
