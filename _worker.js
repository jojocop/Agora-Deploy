const OG = {
  'a1': {
    title: 'Inside The Most Expensive Primary in US History — Agora',
    desc:  'How a 14-year incumbent lost his seat — and what it reveals about the hidden machinery of American democracy.',
    img:   '/massie.jpg'
  },
  'a2': {
    title: "The BC Conservatives' New Leader and What It Means for the Province — Agora",
    desc:  "Kerry-Lynne Findlay's surprise victory reshapes BC's centre-right — and puts the next provincial election firmly in play.",
    img:   '/findlay.jpg'
  }
};

export default {
  async fetch(request, env) {
    const url  = new URL(request.url);
    const path = url.pathname;

    // Serve static files (images, etc.) directly
    if (/\.(jpg|jpeg|png|gif|webp|svg|ico|woff2?|ttf)$/i.test(path)) {
      return env.ASSETS.fetch(request);
    }

    // Serve index.html for all page routes
    const page = await env.ASSETS.fetch(new Request(url.origin + '/index.html', request));
    let html   = await page.text();

    // Defaults
    let title = 'Agora — The Modern Public Square';
    let desc  = 'Finance, politics, philosophy and business — examined without deference. Countless ideas, one forum.';
    let img   = url.origin + '/massie.jpg';

    // Override for specific articles
    const match = path.match(/^\/article\/(\w+)/);
    if (match && OG[match[1]]) {
      title = OG[match[1]].title;
      desc  = OG[match[1]].desc;
      img   = url.origin + OG[match[1]].img;
    }

    const tags = `
  <meta property="og:site_name" content="Agora">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${url.href}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:image" content="${img}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">
  <meta name="twitter:image" content="${img}">`;

    html = html.replace('</head>', tags + '\n</head>');
    return new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
  }
};
