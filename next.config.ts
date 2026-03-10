import type { NextConfig } from 'next';

const isExport = process.env.NEXT_EXPORT === 'true';

const nextConfig: NextConfig = {
  output: isExport ? 'export' : undefined,
  images: {
    unoptimized: isExport,
  },
  reactCompiler: true,
};

export default nextConfig;
