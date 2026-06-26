import Link from 'next/link'

const categories = [
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
  const year = new Date().getFullYear()

  return (
    <footer className="footer border-t border-gray-100 bg-white mt-8">
      {/* Main footer - car site's footer__links-container style */}
      <div className="footer__links-container">

        {/* Brand - footer__rights style */}
        <div className="footer__rights">
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="w-10 h-10 rounded-2xl bg-[#2B59FF] flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ boxShadow: '0 8px 20px rgba(43,89,255,0.25)' }}
            >
              <span className="text-white font-extrabold text-lg">U</span>
            </div>
            <div>
              <div className="font-extrabold text-[#2B2C35] text-lg leading-tight">Ulusmeydanı</div>
              <div className="text-[10px] text-[#747A88] tracking-[0.15em] uppercase">Haber & Gazete</div>
            </div>
          </Link>

          <p className="text-[#747A88] text-sm leading-relaxed max-w-xs">
            Güncel haberler, son dakika gelişmeleri ve derinlemesine analizlerle
            en güvenilir haber kaynağı.
          </p>

          <div className="flex gap-3">
            {[
              { label: 'Twitter/X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
              { label: 'Instagram', path: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 20h11a2 2 0 002-2V6.5a2 2 0 00-2-2H6.5a2 2 0 00-2 2V18a2 2 0 002 2z' },
              { label: 'YouTube', path: 'M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z' },
            ].map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-[#747A88] hover:text-[#2B59FF] hover:border-[#2B59FF]/30 hover:bg-[#F5F8FF] transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Links - footer__links style */}
        <div className="footer__links">
          {/* Kategoriler */}
          <div className="footer__link">
            <h4 className="text-sm font-extrabold text-[#2B2C35] uppercase tracking-[0.1em]">Kategoriler</h4>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/kategori/${cat.slug}`}
                className="text-sm text-[#747A88] hover:text-[#2B59FF] transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Sayfalar */}
          <div className="footer__link">
            <h4 className="text-sm font-extrabold text-[#2B2C35] uppercase tracking-[0.1em]">Sayfalar</h4>
            {[
              { label: 'Ana Sayfa', href: '/' },
              { label: 'Hakkımızda', href: '/' },
              { label: 'İletişim', href: '/' },
              { label: 'Künye', href: '/' },
              { label: 'Gizlilik', href: '/' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-[#747A88] hover:text-[#2B59FF] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* İletişim */}
          <div className="footer__link">
            <h4 className="text-sm font-extrabold text-[#2B2C35] uppercase tracking-[0.1em]">İletişim</h4>
            <a href="mailto:iletisim@ulusmeydan.com" className="text-sm text-[#747A88] hover:text-[#2B59FF] transition-colors">
              iletisim@ulusmeydan.com
            </a>
            <div>
              <p className="text-xs font-extrabold text-[#2B2C35] uppercase tracking-wider mb-2">E-Bülten</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="e-posta adresiniz"
                  className="flex-1 min-w-0 bg-[#F5F8FF] border border-gray-200 text-[#2B2C35] text-xs px-3 py-2 rounded-full focus:outline-none focus:border-[#2B59FF]/40 placeholder:text-[#747A88] transition-all font-medium"
                />
                <button
                  className="shrink-0 w-9 h-9 rounded-full bg-[#2B59FF] flex items-center justify-center hover:opacity-90 transition-all"
                  style={{ boxShadow: '0 4px 12px rgba(43,89,255,0.25)' }}
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            <Link
              href="/admin/giris"
              className="custom-btn bg-[#2B59FF] text-white rounded-full text-xs px-5 py-2.5 w-fit mt-2"
            >
              Admin Girişi
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar - footer__copyrights style */}
      <div className="footer__copyrights border-t border-gray-100">
        <p className="text-sm text-[#747A88]">© {year} Ulusmeydanı Gazetesi. Tüm hakları saklıdır.</p>
        <div className="footer__copyrights-link">
          <span className="text-sm text-[#747A88]">Built with <span className="font-bold text-[#2B59FF]">Next.js</span> + <span className="font-bold text-[#2B59FF]">Supabase</span></span>
        </div>
      </div>
    </footer>
  )
}