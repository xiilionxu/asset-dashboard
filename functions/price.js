export async function onRequest(context) {
  const symbol = new URL(context.request.url).searchParams.get('symbol');
  if (!symbol) {
    return Response.json({ error: 'missing symbol' }, { status: 400 });
  }

  const url = `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (!res.ok) throw new Error(`Yahoo returned ${res.status}`);
    const json = await res.json();
    const price = json?.chart?.result?.[0]?.meta?.regularMarketPrice;
    if (!price) throw new Error('price not found');
    return Response.json({ symbol, price });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 502 });
  }
}
