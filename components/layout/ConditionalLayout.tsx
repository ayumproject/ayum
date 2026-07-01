'use client'

import { usePathname } from 'next/navigation'
import Footer from './footer'
import TopBar from './TopBar'
import SiteHeader from './SiteHeader'
import NavBar from './NavBar'
import BreakingBand from './BreakingBand'
import ExchangeWeatherBar from '@/components/ExchangeWeatherBar'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      {/* 1. Koyu üst bar: tarih + slogan + social + arama */}
      <TopBar />
      {/* 2. Site header: logo + banner + hava durumu */}
      <SiteHeader />
      {/* 3. Piyasa çubuğu: USD EUR GBP ALTIN BIST + hava durumu + saat */}
      <ExchangeWeatherBar />
      {/* 4. Navigasyon: dark navy + kırmızı home + kategoriler */}
      <NavBar />
      {/* 5. SON DAKİKA band: kırmızı, timestampli haberler + oklar */}
      <BreakingBand />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  )
}
