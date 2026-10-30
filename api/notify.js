module.exports = async (req, res) => {
  const ua = req.headers['user-agent'] || '';
  if (/bot|crawl|spider|preview|headless|lighthouse|vercel|screenshot|monitor/i.test(ua)) {
    return res.status(204).end();
  }

  const clean = (v, n = 60) => String(v || '').replace(/[^\w .:/@#?=&%+-]/g, '').slice(0, n);
  const { ref = 'direct', src = '', lang = '', event = '' } = req.query;

  const country = clean(req.headers['x-vercel-ip-country'], 5) || 'unknown';
  let city = '';
  try { city = clean(decodeURIComponent(req.headers['x-vercel-ip-city'] || ''), 40); } catch (e) {}
  const device = /mobile|iphone|android/i.test(ua) ? 'mobile' : 'desktop';

  const lines = [
    `${city ? city + ', ' : ''}${country} (${device})`,
    `From: ${clean(ref)}`,
  ];
  if (src) lines.push(`Link tag: ${clean(src, 30)}`);
  if (lang) lines.push(`Language: ${clean(lang, 10)}`);

  const title = event ? `Portfolio: ${clean(event, 20)}` : 'Portfolio visit';

  await fetch(`https://ntfy.sh/${process.env.NTFY_TOPIC}`, {
    method: 'POST',
    headers: { Title: title },
    body: lines.join('\n'),
  });
  res.status(204).end();
};
