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
    <footer className="bg-[#0f172a] text-slate-400 mt-auto">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 bg-[#dc2626] rounded-xl flex items-center justify-center shadow-lg shadow-red-900/30 group-hover:shadow-red-900/50 transition-shadow">
                <span className="text-white font-black text-xl">U</span>
              </div>
              <div>
                <div className="font-black text-white text-xl leading-tight tracking-tight">Ulusmeydanı</div>
                <div className="text-[10px] text-slate-500 tracking-[0.2em] uppercase font-medium">Haber & Gazete</div>
              </div>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">
              Güncel haberler, son dakika gelişmeleri ve derinlemesine analizlerle
              sizlere en doğru ve güvenilir bilgiyi sunmayı hedefliyoruz.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                { label: 'Twitter', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                { label: 'Facebook', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                { label: 'Instagram', icon: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 20h11a2 2 0 002-2V6.5a2 2 0 00-2-2H6.5a2 2 0 00-2 2V18a2 2 0 002 2z' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-[#dc2626] flex items-center justify-center transition-colors group"
                >
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#dc2626] rounded" />
              Kategoriler
            </h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/kategori/${cat.slug}`}
                    className="text-slate-500 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                  >
                    <svg className="w-3 h-3 text-slate-600 group-hover:text-[#dc2626] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div className="md:col-span-2">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#dc2626] rounded" />
              Sayfalar
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Ana Sayfa', href: '/' },
                { label: 'Hakkımızda', href: '/' },
                { label: 'İletişim', href: '/' },
                { label: 'Künye', href: '/' },
                { label: 'Gizlilik', href: '/' },
                { label: 'Admin', href: '/admin/giris' },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-slate-500 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                  >
                    <svg className="w-3 h-3 text-slate-600 group-hover:text-[#dc2626] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#dc2626] rounded" />
              İletişim
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-500">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>iletisim@ulusmeydan.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-500">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+90 (212) 000 00 00</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-500">
                <svg className="w-4 h-4 mt-0.5 shrink-0 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Türkiye</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-5">
              <p className="text-sm text-slate-500 mb-2">E-bülten:</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="e-posta adresiniz"
                  className="flex-1 bg-slate-800 border border-slate-700 text-white text-xs px-3 py-2.5 rounded-lg focus:outline-none focus:border-[#dc2626] placeholder:text-slate-600"
                />
                <button className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-3 py-2.5 rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <span>© {year} Ulusmeydanı Gazetesi. Tüm hakları saklıdır.</span>
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="text-slate-500 font-semibold">Next.js + Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  )
}