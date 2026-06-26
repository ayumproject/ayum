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
    <footer className="relative bg-[#09090b] border-t border-white/5 mt-auto overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-red-500/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">

          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-5 group w-fit">
              <div
                className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                style={{ boxShadow: '0 0 20px rgba(239,68,68,0.25)' }}
              >
                <span className="text-white font-black text-xl">U</span>
              </div>
              <div>
                <div className="font-black text-white text-lg leading-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  Ulusmeydanı
                </div>
                <div className="text-[9px] text-zinc-600 tracking-[0.2em] uppercase">Haber & Gazete</div>
              </div>
            </Link>
            <p className="text-zinc-600 text-sm leading-relaxed mb-6">
              Güncel haberler, son dakika gelişmeleri ve derinlemesine analizlerle
              en doğru ve güvenilir bilgiyi sunuyoruz.
            </p>

            {/* Social links */}
            <div className="flex gap-2">
              {[
                { label: 'Twitter/X', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                { label: 'Instagram', path: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 20h11a2 2 0 002-2V6.5a2 2 0 00-2-2H6.5a2 2 0 00-2 2V18a2 2 0 002 2z' },
                { label: 'YouTube', path: 'M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z' },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl border border-white/8 bg-white/4 flex items-center justify-center text-zinc-500 hover:text-white hover:border-red-500/30 hover:bg-red-500/10 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-400 mb-5">Kategoriler</h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/kategori/${cat.slug}`}
                    className="text-sm text-zinc-600 hover:text-zinc-200 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-zinc-700 group-hover:bg-red-500 transition-colors" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-400 mb-5">Sayfalar</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Ana Sayfa', href: '/' },
                { label: 'Hakkımızda', href: '/' },
                { label: 'İletişim', href: '/' },
                { label: 'Künye', href: '/' },
                { label: 'Gizlilik', href: '/' },
                { label: 'Admin Girişi', href: '/admin/giris' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-zinc-600 hover:text-zinc-200 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-zinc-700 group-hover:bg-red-500 transition-colors" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-black uppercase tracking-[0.15em] text-zinc-400 mb-5">E-Bülten</h4>
            <p className="text-sm text-zinc-600 mb-4 leading-relaxed">
              Son haberleri doğrudan e-postanıza alın.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="e-posta adresiniz"
                className="flex-1 min-w-0 bg-zinc-900 border border-white/8 text-zinc-300 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-red-500/40 focus:bg-zinc-800 placeholder:text-zinc-700 transition-all"
              />
              <button
                className="shrink-0 w-10 h-10 rounded-xl bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
                style={{ boxShadow: '0 0 15px rgba(239,68,68,0.25)' }}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>

            {/* Contact */}
            <div className="mt-5 space-y-2">
              <a href="mailto:iletisim@ulusmeydan.com" className="flex items-center gap-2.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors group">
                <svg className="w-4 h-4 text-zinc-700 group-hover:text-red-500 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                iletisim@ulusmeydan.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-zinc-700">© {year} Ulusmeydanı Gazetesi. Tüm hakları saklıdır.</span>
          <div className="flex items-center gap-1.5 text-xs text-zinc-700">
            <span>Built with</span>
            <span className="text-zinc-500 font-semibold">Next.js</span>
            <span>+</span>
            <span className="text-zinc-500 font-semibold">Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  )
}