import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  /* Prevents the build from failing on minor Type or Lint errors 
     (Use with caution!) */
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },

  experimental: {
    // The "Safety First" settings for Vercel's 8GB runner
    workerThreads: false,
    cpus: 1,

    // Optimizes package imports to reduce bundle size automatically
    optimizePackageImports: ['lucide-react', '@headlessui/react'],
  },
};

export default nextConfig;