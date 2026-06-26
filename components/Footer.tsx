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
    <footer className="bg-gray-900 text-gray-400 mt-6">
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4 group w-fit">
              <div className="w-10 h-10 rounded-full bg-[#C0282D] flex items-center justify-center shrink-0">
                <span className="text-white font-black text-lg">U</span>
              </div>
              <div className="leading-tight">
                <div className="text-white font-black text-base">Ulusmeydanı</div>
                <div className="text-gray-500 text-[10px] italic">Haber & Gazete</div>
              </div>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Güncel haberler ve derinlemesine analizlerle güvenilir haber kaynağınız.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-gray-700 pb-2">Kategoriler</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/kategori/${cat.slug}`} className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#C0282D]" />
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-gray-700 pb-2">Sayfalar</h4>
            <ul className="space-y-2">
              {[
                { label: 'Ana Sayfa', href: '/' },
                { label: 'Hakkımızda', href: '/' },
                { label: 'İletişim', href: '/' },
                { label: 'Gizlilik', href: '/' },
                { label: 'Admin Girişi', href: '/admin/giris' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-b border-gray-700 pb-2">İletişim</h4>
            <div className="space-y-2 text-sm text-gray-500">
              <p>iletisim@ulusmeydan.com</p>
            </div>
            <div className="flex gap-2 mt-4">
              {['T', 'F', 'I'].map((s) => (
                <a key={s} href="#" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-[#C0282D] flex items-center justify-center text-gray-400 hover:text-white text-xs font-bold transition-all">
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <span>© {year} Ulusmeydanı Gazetesi. Tüm hakları saklıdır.</span>
          <span>Next.js + Supabase</span>
        </div>
      </div>
    </footer>
  )
}