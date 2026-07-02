import Link from 'next/link'
import Image from 'next/image'

const LOGO_URL = 'https://res.cloudinary.com/dfbwqwibi/image/upload/sjbiqbjcew51rhcdqy2w'

const catLinks = [
  { name: 'Gündem',       slug: 'gundem' },
  { name: 'Ankara',       slug: 'ankara' },
  { name: 'Siyaset',      slug: 'siyaset' },
  { name: 'Ekonomi',      slug: 'ekonomi' },
  { name: 'Spor',         slug: 'spor' },
  { name: 'Dünya',        slug: 'dunya' },
  { name: 'Kültür-Sanat', slug: 'kultur-sanat' },
  { name: 'Yaşam',        slug: 'yasam' },
]

const socials = [
  { title: 'Twitter / X', href: 'https://x.com/ulusmeydan', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { title: 'Facebook',    href: 'https://facebook.com', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  { title: 'Instagram',   href: 'https://instagram.com', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
  { title: 'YouTube',     href: 'https://youtube.com', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
]

export default function Footer() {
  return (
    <footer className="mt-12">

      {/* ── Top accent: yarı lacivert / yarı kırmızı ── */}
      <div className="h-[5px] w-full flex">
        <div className="flex-1 bg-[#1a1a2e]" />
        <div className="flex-1 bg-red-600" />
      </div>

      {/* ── Ana Footer — lacivert zemin ── */}
      <div className="bg-[#1a1a2e]">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-16 py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

            {/* ── Marka kolonu — 4 ── */}
            <div className="md:col-span-4 flex flex-col gap-6">

              {/* Logo + site adı */}
              <Link href="/" className="flex items-center gap-4 w-fit group">
                <div className="bg-white/5 rounded-2xl p-2 border border-white/10 group-hover:border-white/25 transition-all">
                  <Image src={LOGO_URL} alt="Ulusmeydan" width={56} height={56}
                    className="w-14 h-14 object-contain" />
                </div>
                <div>
                  <div className="text-[22px] font-black text-white leading-none tracking-tight">
                    Ulus<span className="text-red-500">meydan</span>
                  </div>
                  <div className="text-[10px] text-white uppercase tracking-[0.2em] mt-1.5">Haber & Gazete</div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Canlı Yayın</span>
                  </div>
                </div>
              </Link>

              {/* Slogan */}
              <p className="text-white text-sm leading-relaxed">
                Gerçeğin peşinde, halkın yanında.<br />
                Ankara ve Türkiye'den güncel haberler,<br />
                doğru bilgi, güvenilir gazetecilik.
              </p>

              {/* WhatsApp kartı */}
              <a href="https://wa.me/905533219779" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-green-500/40 rounded-xl px-4 py-3 transition-all group">
                <div className="w-9 h-9 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[9px] text-white uppercase tracking-widest">WhatsApp İhbar Hattı</div>
                  <div className="text-white font-bold text-sm group-hover:text-green-400 transition-colors">0 553 321 97 79 </div>
                </div>
              </a>

              {/* Sosyal medya */}
              <div className="flex gap-2">
                {socials.map(({ title, href, icon }) => (
                  <a key={title} href={href} title={title} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-600 border border-white/10 hover:border-red-600 flex items-center justify-center text-white hover:text-white transition-all">
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* ── Kategoriler — 3 ── */}
            <div className="md:col-span-3">
              <h4 className="text-white font-extrabold text-[11px] uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-600 rounded-sm shrink-0" />
                Kategoriler
              </h4>
              <ul className="space-y-2">
                {catLinks.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/kategori/${c.slug}`}
                      className="text-white text-[13px] transition-colors flex items-center gap-2 group py-0.5">
                      <span className="w-1 h-1 rounded-full bg-red-600/60 group-hover:bg-red-500 transition-colors shrink-0" />
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Sayfalar — 2 ── */}
            <div className="md:col-span-2">
              <h4 className="text-white font-extrabold text-[11px] uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-600 rounded-sm shrink-0" />
                Sayfalar
              </h4>
              <ul className="space-y-2">
                {[
                  { label: 'Ana Sayfa',   href: '/' },
                  { label: 'Yazarlar',    href: '/yazar' },
                  { label: 'Hakkımızda', href: '/about' },
                  { label: 'İletişim',   href: '/contact' },
                  { label: 'Gizlilik',   href: '/' },
                  { label: 'Admin',      href: '/admin/giris' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href}
                      className="text-white text-[13px] transition-colors py-0.5 block hover:text-red-400">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── İletişim — 3 ── */}
            <div className="md:col-span-3">
              <h4 className="text-white font-extrabold text-[11px] uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-600 rounded-sm shrink-0" />
                İletişim
              </h4>

              <div className="space-y-3 mb-6">
                <a href="mailto:ulusmeydan@gmail.com"
                  className="flex items-center gap-3 text-white hover:text-red-400 text-sm transition-colors group">
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-red-600/20 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                </a>
                <div className="flex items-center gap-3 text-white text-sm">
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  Ankara, Türkiye
                </div>
              </div>

              {/* Son dakika banner */}
              <div className="rounded-xl p-4 border border-red-600/30 bg-red-600/10">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                  <span className="text-red-400 text-[10px] font-extrabold uppercase tracking-widest">Son Dakika</span>
                </div>
                <p className="text-white text-xs leading-relaxed">
                  Anlık gelişmeler için siteyi takip edin veya bildirimlerimize abone olun.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ── Yatay ayraç — ince kırmızı çizgi ── */}
        <div className="max-w-[1440px] mx-auto px-6 sm:px-16">
          <div className="h-px bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />
        </div>

        {/* ── Alt bar ── */}
        <div className="max-w-[1440px] mx-auto px-6 sm:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-white">
            © {new Date().getFullYear()} Ulusmeydan Gazetesi. Tüm hakları saklıdır.
          </span>
          <div className="flex items-center gap-5 text-xs text-white">
            <Link href="/" className="hover:text-red-400 transition-colors">Gizlilik Politikası</Link>
            <Link href="/" className="hover:text-red-400 transition-colors">Kullanım Koşulları</Link>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-400">Canlı</span>
            </div>
          </div>
        </div>
      </div>

    </footer>
  )
}
