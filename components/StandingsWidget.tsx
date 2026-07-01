import Link from 'next/link'

// Sofascore'da Türkiye Süper Lig unique-tournament ID = 52
const TOURNAMENT_ID = 52
const HOST = 'sportapi7.p.rapidapi.com'
const BASE = `https://${HOST}/api/v1`

// Sofascore team logoları PUBLIC — API key gerekmez
function teamLogoUrl(teamId: number) {
  return `https://api.sofascore.app/api/v1/team/${teamId}/image`
}

interface StandingRow {
  team: { id: number; name: string; shortName: string }
  position: number
  wins: number
  draws: number
  losses: number
  scoresFor: number
  scoresAgainst: number
  points: number
  played?: number
}

async function apiFetch(path: string, cacheSecs: number) {
  const key = process.env.RAPIDAPI_KEY
  if (!key) return null
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { 'x-rapidapi-key': key, 'x-rapidapi-host': HOST, 'Content-Type': 'application/json' },
      next: { revalidate: cacheSecs },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

async function fetchStandings(): Promise<{ rows: StandingRow[]; seasonName: string }> {
  const empty = { rows: [], seasonName: '' }
  try {
    // 1) Sezon listesi — yılda birkaç kez değişir, 24 saat cache (1 istek/gün)
    const seasonsJson = await apiFetch(`/unique-tournament/${TOURNAMENT_ID}/seasons`, 86400)
    if (!seasonsJson?.seasons?.length) return empty
    const latestSeason = seasonsJson.seasons[0] as { id: number; name: string; year?: string }

    // 2) Puan tablosu — maç günleri değişir, 3 saat cache (~8 istek/gün)
    const json = await apiFetch(`/unique-tournament/${TOURNAMENT_ID}/season/${latestSeason.id}/standings/total`, 10800)
    const rows: StandingRow[] = json?.standings?.[0]?.rows || []
    return {
      rows: rows.sort((a, b) => a.position - b.position),
      seasonName: latestSeason.year || latestSeason.name || '',
    }
  } catch {
    return empty
  }
}

export default async function StandingsWidget() {
  const { rows: standings, seasonName } = await fetchStandings()
  if (!standings || standings.length === 0) return null

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(43,89,255,0.06)]">
      <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-[#f79761]" />
          <div>
            <h3 className="text-[15px] font-extrabold text-[#2B2C35]" style={{ letterSpacing: '-0.02em' }}>Süper Lig</h3>
            {seasonName && <p className="text-[10px] text-[#747A88] font-medium">{seasonName} Sezonu</p>}
          </div>
        </div>
        <Link href="/kategori/spor" className="text-[11px] font-bold text-[#2B59FF] hover:underline">Tümü</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#F5F8FF] text-[#747A88]">
              <th className="text-left px-3 py-2 font-bold w-6">#</th>
              <th className="text-left px-2 py-2 font-bold">Takım</th>
              <th className="text-center px-1.5 py-2 font-bold">O</th>
              <th className="text-center px-1.5 py-2 font-bold">G</th>
              <th className="text-center px-1.5 py-2 font-bold">B</th>
              <th className="text-center px-1.5 py-2 font-bold">M</th>
              <th className="text-center px-1.5 py-2 font-bold">AV</th>
              <th className="text-center px-2 py-2 font-bold text-[#2B59FF]">P</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s, i) => {
              const played = s.played ?? (s.wins + s.draws + s.losses)
              const gd = s.scoresFor - s.scoresAgainst
              return (
                <tr key={s.team.id}
                  className={`border-t border-gray-50 hover:bg-[#F5F8FF] transition-colors ${
                    i < 4 ? 'bg-[#EEF2FF]/30' : i >= standings.length - 3 ? 'bg-red-50/30' : ''
                  }`}>
                  <td className="px-3 py-2">
                    <span className={`font-extrabold ${i < 4 ? 'text-[#2B59FF]' : i >= standings.length - 3 ? 'text-red-500' : 'text-[#747A88]'}`}>
                      {s.position}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-1.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={teamLogoUrl(s.team.id)}
                        alt={s.team.shortName || s.team.name}
                        className="w-4 h-4 object-contain shrink-0"
                        loading="lazy"
                        width={16}
                        height={16}
                      />
                      <span className="font-semibold text-[#2B2C35] truncate max-w-[90px]">{s.team.shortName || s.team.name}</span>
                    </div>
                  </td>
                  <td className="px-1.5 py-2 text-center text-[#747A88]">{played}</td>
                  <td className="px-1.5 py-2 text-center text-[#747A88]">{s.wins}</td>
                  <td className="px-1.5 py-2 text-center text-[#747A88]">{s.draws}</td>
                  <td className="px-1.5 py-2 text-center text-[#747A88]">{s.losses}</td>
                  <td className="px-1.5 py-2 text-center text-[#747A88]">{gd > 0 ? '+' : ''}{gd}</td>
                  <td className="px-2 py-2 text-center font-extrabold text-[#2B59FF]">{s.points}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2.5 bg-[#F5F8FF] flex items-center gap-4 text-[10px] text-[#747A88] font-medium border-t border-gray-50">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#2B59FF]" />Avrupa</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" />Düşme Hattı</span>
      </div>
    </div>
  )
}
