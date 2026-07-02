/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Modern formatlar — AVIF/WebP ile ~8MB tasarruf
    formats: ['image/avif', 'image/webp'],
    // Daha uzun cache — görseller değişmez
    minimumCacheTTL: 86400,
    // Responsive breakpoint'ler
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.in' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: '**.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  // Sıkıştırma
  compress: true,
  // Production'da console.log temizle
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // HTTP headers — cache + security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
      {
        // Statik görseller 1 yıl cache
        source: '/(.*).(png|jpg|jpeg|svg|ico|webp|avif)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
};

module.exports = nextConfig;
