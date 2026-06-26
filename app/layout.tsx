import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Ulusmeydan Gazetesi',
    template: '%s | Ulusmeydan Gazetesi',
  },
  description: 'Güncel haberler, son dakika gelişmeleri ve kapsamlı analizler için Ulusmeydan Gazetesi.',
  keywords: ['haber', 'son dakika', 'gündem', 'spor', 'ekonomi'],
  openGraph: {
    siteName: 'Ulusmeydan Gazetesi',
    locale: 'tr_TR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-100">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}