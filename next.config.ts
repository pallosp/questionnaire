import type { NextConfig } from 'next';

const isExport = process.env.NEXT_EXPORT === 'true';

const nextConfig: NextConfig = {
  output: isExport ? 'export' : undefined,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  images: {
    unoptimized: isExport,
  },
  reactCompiler: true,

  // Partial prerendering:
  // https://youtu.be/myjrQS_7zNk?t=853
  cacheComponents: true,
};

export default nextConfig;
