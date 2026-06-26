import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#2c3e50] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Hakkında */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#c0392b] text-white font-black text-2xl px-3 py-1 rounded">
                U
              </div>
              <div>
                <div className="font-black text-xl leading-tight">ULUSMEYDAN</div>
                <div className="text-[10px] text-gray-400 tracking-widest uppercase">Gazete</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Güncel haberler, son dakika gelişmeleri ve derinlemesine analizlerle
              Ulusmeydan Gazetesi yanınızda. Güvenilir habercilik anlayışımızla
              sizlere en doğru bilgiyi sunmayı hedefliyoruz.
            </p>
          </div>

          {/* Kategoriler */}
          <div>
            <h4 className="font-bold text-sm mb-4 text-gray-300 uppercase tracking-wider">
              Kategoriler
            </h4>
            <ul className="space-y-2">
              {[
                { name: 'Gündem', slug: 'gundem' },
                { name: 'Spor', slug: 'spor' },
                { name: 'Ekonomi', slug: 'ekonomi' },
                { name: 'Siyaset', slug: 'siyaset' },
                { name: 'Teknoloji', slug: 'teknoloji' },
                { name: 'Dünya', slug: 'dunya' },
              ].map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/kategori/${cat.slug}`}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="font-bold text-sm mb-4 text-gray-300 uppercase tracking-wider">
              İletişim
            </h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@ulusmeydan.com</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Türkiye</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-xs">
            © {year} Ulusmeydan Gazetesi. Tüm hakları saklıdır.
          </p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="/" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
            <Link href="/" className="hover:text-white transition-colors">Kullanım Şartları</Link>
            <Link href="/admin/giris" className="hover:text-white transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}