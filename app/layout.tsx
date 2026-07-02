import './globals.css';
import type { Metadata } from 'next';
import ConditionalLayout from '@/components/layout/ConditionalLayout';

const BASE_URL = 'https://ulusmeydan.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Ulusmeydan — Güncel Haberler, Son Dakika Ankara',
    template: '%s | Ulusmeydan',
  },
  description: "Ankara ve Türkiye'den güncel haberler, son dakika gelişmeleri. Doğru, tarafsız ve güvenilir gazetecilik.",
  keywords: ['ankara haberleri', 'gündem', 'son dakika', 'siyaset', 'ekonomi', 'spor', 'ulusmeydan', 'ankara gazetesi'],
  authors: [{ name: 'Ulusmeydan Gazetesi', url: BASE_URL }],
  creator: 'Ulusmeydan Gazetesi',
  publisher: 'Ulusmeydan Gazetesi',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: BASE_URL,
    siteName: 'Ulusmeydan',
    title: "Ulusmeydan — Güncel Haberler, Son Dakika Ankara",
    description: "Ankara ve Türkiye'den güncel haberler, son dakika gelişmeleri.",
    images: [{
      url: 'https://res.cloudinary.com/dfbwqwibi/image/upload/sjbiqbjcew51rhcdqy2w',
      width: 512, height: 512, alt: 'Ulusmeydan Gazetesi',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ulusmeydan — Güncel Haberler',
    description: "Ankara ve Türkiye'den güncel haberler.",
    images: ['https://res.cloudinary.com/dfbwqwibi/image/upload/sjbiqbjcew51rhcdqy2w'],
  },
  alternates: { canonical: BASE_URL },
  verification: {
    // Google Search Console doğrulama kodunu buraya ekle
    // google: 'BURAYA_GSC_KODU',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-[#F5F8FF] font-sans antialiased">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
