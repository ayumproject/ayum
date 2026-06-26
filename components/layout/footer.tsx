import Link from 'next/link'

const catLinks = [
  { name: 'Gündem', slug: 'gundem' },
  { name: 'Siyaset', slug: 'siyaset' },
  { name: 'Ekonomi', slug: 'ekonomi' },
  { name: 'Spor', slug: 'spor' },
  { name: 'Dünya', slug: 'dunya' },
  { name: 'Teknoloji', slug: 'teknoloji' },
  { name: 'Kültür-Sanat', slug: 'kultur-sanat' },
  { name: 'Yerel', slug: 'yerel' },
]

export default function Footer() {
  return (
    <footer className="bg-[#2B2C35] text-white mt-12">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-16 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="w-11 h-11 rounded-full bg-[#2B59FF] flex items-center justify-center shadow-[0_4px_14px_rgba(43,89,255,0.5)]">
                <span className="text-white font-extrabold text-xl leading-none">U</span>
              </div>
              <div>
                <div className="text-[18px] font-extrabold tracking-tight text-white">
                  Uluse<span className="text-[#2B59FF]">ydan</span>ı
                </div>
                <div className="text-[10px] text-[#747A88] italic">Haber & Gazete</div>
              </div>
            </Link>
            <p className="text-[#747A88] text-sm leading-relaxed max-w-xs">
              Güncel haberler, doğru bilgi ve güvenilir yayıncılık ile yanınızdayız.
            </p>
            {/* Social links */}
            <div className="flex gap-2">
              {['T', 'F', 'I', 'Y'].map((s) => (
                <a key={s} href="#"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#2B59FF] border border-white/10 flex items-center justify-center text-[#747A88] hover:text-white text-xs font-bold transition-all">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-widest mb-5 pb-2 border-b border-white/10">
              Kategoriler
            </h4>
            <ul className="space-y-2.5">
              {catLinks.map((c) => (
                <li key={c.slug}>
                  <Link href={`/kategori/${c.slug}`}
                    className="text-[#747A88] hover:text-white text-sm transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#2B59FF]" />
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-widest mb-5 pb-2 border-b border-white/10">
              Sayfalar
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Ana Sayfa', href: '/' },
                { label: 'Hakkımızda', href: '/' },
                { label: 'İletişim', href: '/' },
                { label: 'Gizlilik Politikası', href: '/' },
                { label: 'Kullanım Koşulları', href: '/' },
                { label: 'Admin Girişi', href: '/admin/giris' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href}
                    className="text-[#747A88] hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-widest mb-5 pb-2 border-b border-white/10">
              İletişim
            </h4>
            <div className="space-y-3 text-sm text-[#747A88]">
              <p>iletisim@ulusmeydan.com</p>
              <p>+90 (312) 000 00 00</p>
            </div>
            <div className="mt-6 p-4 bg-[#2B59FF]/10 rounded-2xl border border-[#2B59FF]/20">
              <p className="text-[12px] font-bold text-[#2B59FF] mb-1">Son Dakika Bildirimleri</p>
              <p className="text-[11px] text-[#747A88]">Haberleri ilk siz öğrenin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#747A88]">
          <span>© {new Date().getFullYear()} Ulusmeydanı Gazetesi. Tüm hakları saklıdır.</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2B59FF] animate-pulse" />
            <span>Canlı yayın</span>
          </div>
        </div>
      </div>
    </footer>
  )
}