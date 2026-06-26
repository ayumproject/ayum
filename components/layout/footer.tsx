import Link from 'next/link'

const catLinks = [
  { name: 'Gündem',      slug: 'gundem' },
  { name: 'Siyaset',     slug: 'siyaset' },
  { name: 'Ekonomi',     slug: 'ekonomi' },
  { name: 'Spor',        slug: 'spor' },
  { name: 'Dünya',       slug: 'dunya' },
  { name: 'Teknoloji',   slug: 'teknoloji' },
  { name: 'Kültür-Sanat',slug: 'kultur-sanat' },
  { name: 'Yerel',       slug: 'yerel' },
]

export default function Footer() {
  return (
    <footer className="mt-12 bg-white border-t border-gray-100">

      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(to right, #2B59FF, #f79761, #2B59FF)' }} />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-16 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Brand — col 4 */}
          <div className="md:col-span-4 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3 w-fit group">
              <div className="w-12 h-12 rounded-full bg-[#2B59FF] flex items-center justify-center shadow-[0_4px_14px_rgba(43,89,255,0.3)] group-hover:shadow-[0_6px_20px_rgba(43,89,255,0.4)] transition-shadow">
                <span className="text-white font-extrabold text-xl leading-none">U</span>
              </div>
              <div>
                <div className="text-[20px] font-extrabold tracking-tight text-[#2B2C35] leading-none">
                  Uluse<span className="text-[#2B59FF]">ydan</span>ı
                </div>
                <div className="text-[11px] text-[#747A88] italic mt-0.5">Haber & Gazete</div>
              </div>
            </Link>

            <p className="text-[#747A88] text-sm leading-relaxed max-w-xs">
              Güncel haberler, doğru bilgi ve güvenilir yayıncılıkla her zaman yanınızdayız.
            </p>

            {/* Social */}
            <div className="flex gap-2">
              {[
                { label: 'T', title: 'Twitter' },
                { label: 'F', title: 'Facebook' },
                { label: 'I', title: 'Instagram' },
                { label: 'Y', title: 'YouTube' },
              ].map(({ label, title }) => (
                <a
                  key={label}
                  href="#"
                  title={title}
                  className="w-9 h-9 rounded-full bg-[#F5F8FF] hover:bg-[#2B59FF] border border-gray-200 hover:border-[#2B59FF] flex items-center justify-center text-xs font-extrabold text-[#747A88] hover:text-white transition-all"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Categories — col 3 */}
          <div className="md:col-span-3">
            <h4 className="text-[#2B2C35] font-extrabold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-[#2B59FF] rounded-full" />
              Kategoriler
            </h4>
            <ul className="space-y-2.5">
              {catLinks.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/kategori/${c.slug}`}
                    className="text-[#747A88] hover:text-[#2B59FF] text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#2B59FF] group-hover:bg-[#f79761] transition-colors" />
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages — col 2 */}
          <div className="md:col-span-2">
            <h4 className="text-[#2B2C35] font-extrabold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-[#f79761] rounded-full" />
              Sayfalar
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Ana Sayfa',   href: '/' },
                { label: 'Hakkımızda', href: '/' },
                { label: 'İletişim',   href: '/' },
                { label: 'Gizlilik',   href: '/' },
                { label: 'Admin',      href: '/admin/giris' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href}
                    className="text-[#747A88] hover:text-[#2B59FF] text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info — col 3 */}
          <div className="md:col-span-3">
            <h4 className="text-[#2B2C35] font-extrabold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-[#f79761] rounded-full" />
              İletişim
            </h4>

            {/* Breaking badge */}
            <div className="rounded-2xl p-4 mb-5 bg-[#F5F8FF] border border-[#2B59FF]/10">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#f79761] animate-pulse" />
                <span className="text-[#f79761] text-[10px] font-extrabold uppercase tracking-widest">Son Dakika</span>
              </div>
              <p className="text-[#747A88] text-xs">Anlık haberler için siteyi takip edin</p>
            </div>

            <div className="text-sm text-[#747A88] space-y-2">
              <p className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 shrink-0 text-[#2B59FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                iletisim@ulusmeydan.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100 bg-[#F5F8FF]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-16 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-[#747A88]">
            © {new Date().getFullYear()} Ulusmeydanı Gazetesi. Tüm hakları saklıdır.
          </span>
          <div className="flex items-center gap-4 text-xs text-[#747A88]">
            <Link href="/" className="hover:text-[#2B59FF] transition-colors">Gizlilik Politikası</Link>
            <Link href="/" className="hover:text-[#2B59FF] transition-colors">Kullanım Koşulları</Link>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2B59FF] animate-pulse" />
              <span>Canlı</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}