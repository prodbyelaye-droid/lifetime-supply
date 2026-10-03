/* GET /api/muso · the career totals in the credits section, from Muso.AI.

   The key is the Vercel env var MUSO_API_KEY (Production and Preview). It is
   read here, on the server, and never reaches the browser or this repo.
   Vercel's CDN keeps a good answer for a day, so Muso is asked about once a
   day however many people load the page. If Muso is down or the key is
   missing this answers 502 and the page keeps the numbers written in
   index.html. Docs: https://developer.muso.ai/workspace */

const BASE = 'https://api.developer.muso.ai/v4a';
const PROFILE = process.env.MUSO_PROFILE_ID || '22fd6589-91b4-4c55-b5ad-da7f13e2a390';

function count(v) {
  return typeof v === 'number' && isFinite(v) && v > 0 ? Math.floor(v) : 0;
}

async function muso(path, key) {
  const r = await fetch(BASE + path, {
    headers: { 'workspace-api-key': key, accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error('Muso answered ' + r.status + ' on ' + path);
  const body = await r.json();
  return (Array.isArray(body.data) ? body.data[0] : body.data) || {};
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method' });
  }
  try {
    const key = process.env.MUSO_API_KEY;
    if (!key) throw new Error('MUSO_API_KEY is not set');

    /* streams, views and Shazams come from analytics; the credit count comes
       from the profile so it matches the public Muso page the section links to */
    const [stats, profile] = await Promise.all([
      muso('/analytics/profile/' + PROFILE, key),
      muso('/profile/' + PROFILE, key).catch(function () { return {}; }),
    ]);
    const sum = stats.summary || {};
    const out = {
      streams: count(sum.streams),
      views: count(sum.views),
      shazams: count(sum.shazams),
      credits: count(profile.creditCount) || count(stats.creditCount),
    };
    if (!out.streams) throw new Error('Muso sent no stream count');

    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).json(out);
  } catch (err) {
    console.error('[api/muso]', err && err.message);
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300');
    return res.status(502).json({ error: 'unavailable' });
  }
};
