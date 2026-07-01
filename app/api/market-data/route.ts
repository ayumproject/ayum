import { NextResponse } from 'next/server'

async function yahooQuote(symbol: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`,
      { headers: { 'User-Agent': 'Mozilla/5.0' }, next: { revalidate: 300 } }
    )
    if (!res.ok) return null
    const json = await res.json()
    const price = json?.chart?.result?.[0]?.meta?.regularMarketPrice
    return typeof price === 'number' ? price : null
  } catch { return null }
}

async function btcPrice(): Promise<number | null> {
  try {
    const res = await fetch(
      'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
      { next: { revalidate: 120 } }
    )
    if (!res.ok) return null
    const json = await res.json()
    return json?.price ? Math.round(parseFloat(json.price)) : null
  } catch { return null }
}

export async function GET() {
  const [goldUSD, usdTry, bistRaw, brentUSD, silverUSD, btcUSD] = await Promise.all([
    yahooQuote('GC=F'),      // Altın USD/troy oz
    yahooQuote('USDTRY=X'),  // USD/TL
    yahooQuote('XU100.IS'),  // BIST 100
    yahooQuote('BZ=F'),      // Brent petrol USD/varil
    yahooQuote('SI=F'),      // Gümüş USD/troy oz
    btcPrice(),              // Bitcoin USD
  ])

  const bist     = bistRaw   !== null ? Math.round(bistRaw)   : null
  const brent    = brentUSD  !== null ? parseFloat(brentUSD.toFixed(2)) : null
  const btc      = btcUSD

  // TL cinsinden hesaplamalar
  let goldGram:   number | null = null
  let silverGram: number | null = null

  if (goldUSD   !== null && usdTry !== null)
    goldGram   = Math.round((goldUSD * usdTry) / 31.1035)

  if (silverUSD !== null && usdTry !== null)
    silverGram = Math.round((silverUSD * usdTry) / 31.1035)

  return NextResponse.json(
    { bist, goldGram, silverGram, brent, btc },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
  )
}
