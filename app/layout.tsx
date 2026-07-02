import './globals.css';
import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import ConditionalLayout from '@/components/layout/ConditionalLayout';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
  preload: true,
});

const BASE_URL = 'https://ulusmeydan.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Ulusmeydan — Ankara\'nın Güncel Haber Kaynağı | Son Dakika',
    template: '%s | Ulusmeydan',
  },
  description: "Ulusmeydan, Ulus Meydanı ve Ankara'dan güncel haberler, son dakika gelişmeleri. Siyaset, ekonomi, spor ve yerel haberlerde Türkiye'nin güvenilir haber kaynağı.",
  keywords: [
    'ulusmeydan', 'ulus meydan', 'ulus meydanı', 'ulusmeydanı',
    'ankara haberleri', 'ankara son dakika', 'ankara gazetesi',
    'güncel haberler', 'son dakika haberleri', 'türkiye haberleri',
    'siyaset haberleri', 'ekonomi haberleri', 'spor haberleri',
    'yerel haberler', 'ankara gündem', 'ankara haber',
  ],
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
    title: "Ulusmeydan | Güncel Haberler, Son Dakika Ankara",
    description: "Ankara ve Türkiye'den güncel haberler, son dakika gelişmeleri.",
    images: [{
      url: 'https://res.cloudinary.com/dfbwqwibi/image/upload/sjbiqbjcew51rhcdqy2w',
      width: 512, height: 512, alt: 'Ulusmeydan Gazetesi',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ulusmeydan',
    creator: '@ulusmeydan',
    title: 'Ulusmeydan — Güncel Haberler',
    description: "Ankara ve Türkiye'den güncel haberler.",
    images: ['https://res.cloudinary.com/dfbwqwibi/image/upload/sjbiqbjcew51rhcdqy2w'],
  },
  alternates: { canonical: BASE_URL },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/favicon.png',
    shortcut: '/favicon.ico',
  },
  verification: {
    // Google Search Console doğrulama kodunu buraya ekle:
    // google: 'BURAYA_GSC_KODU',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        {/* Charset & Viewport */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Marka rengi — tarayıcı toolbar */}
        <meta name="theme-color" content="#1a1a2e" />
        <meta name="msapplication-TileColor" content="#1a1a2e" />

        {/* Favicon & ikonlar */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="https://res.cloudinary.com/dfbwqwibi/image/upload/sjbiqbjcew51rhcdqy2w" />

        {/* Yayın adı / site adı ek meta */}
        <meta name="application-name" content="Ulusmeydan" />
        <meta name="apple-mobile-web-app-title" content="Ulusmeydan" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Geo & dil */}
        <meta name="geo.region" content="TR-06" />
        <meta name="geo.placename" content="Ankara" />
        <meta name="language" content="Turkish" />
        <meta httpEquiv="content-language" content="tr" />

        {/* Güvenlik */}
        <meta name="referrer" content="origin-when-cross-origin" />

        {/* Cloudinary preconnect */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
      </head>
      <body className={`${manrope.variable} min-h-screen flex flex-col bg-[#F5F8FF] font-sans antialiased`}>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
