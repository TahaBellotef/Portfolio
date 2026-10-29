   module.exports = async (req, res) => {
     const ua = req.headers['user-agent'] || '';
     if (/bot|crawl|spider|preview/i.test(ua)) {
       return res.status(204).end();
     }

     const country = req.headers['x-vercel-ip-country'] || 'unknown';

     await fetch(`https://ntfy.sh/${process.env.NTFY_TOPIC}`, {
       method: 'POST',
       headers: { Title: 'Portfolio visit' },
       body: `Someone visited from ${country}`,
     });

     res.status(204).end();
   };
