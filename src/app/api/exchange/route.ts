export const runtime = 'edge'
export const revalidate = 3600

export async function GET(req: Request) {
  const url = new URL(req.url)
  const base = url.searchParams.get('base') || 'USD'

  try {
    const upstream = await fetch(`https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    })

    if (!upstream.ok) {
      throw new Error(`Upstream HTTP ${upstream.status}`)
    }

    const data = await upstream.json()
    return new Response(JSON.stringify({ base, rates: data.rates, date: data.date }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to fetch exchange rates' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}