import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Ulusmeydanı Gazetesi',
    template: '%s | Ulusmeydanı',
  },
  description: 'Güncel haberler, son dakika gelişmeleri ve kapsamlı analizler.',
  keywords: ['haber', 'son dakika', 'gündem', 'spor', 'ekonomi', 'siyaset'],
  openGraph: {
    siteName: 'Ulusmeydanı Gazetesi',
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
    <html lang="tr" className="h-full">
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}