const OG = {
  'massie-primary': {
    title: 'Inside The Most Expensive Primary in US History — Agora',
    desc:  'How a 14-year incumbent lost his seat — and what it reveals about the hidden machinery of American democracy.',
    img:   null
  },
  'findlay-bc-conservatives': {
    title: "The BC Conservatives' New Leader and What It Means for the Province — Agora",
    desc:  "Kerry-Lynne Findlay's surprise victory reshapes BC's centre-right — and puts the next provincial election firmly in play.",
    img:   null
  },
  'paramount-wbd-merger': {
    title: "The Clock Is Ticking: Why the Paramount-Warner Bros. Deal Still Isn't Done — Agora",
    desc:  "Shareholders said yes. Lawyers filed the papers. But regulatory headwinds, a restless industry, and a ticking clock mean Hollywood's biggest merger is far from finished.",
    img:   null
  },
  'ai-will-not-replace-accountants': {
    title: "Why AI Will Not Replace Accountants — Agora",
    desc:  "The firms spending the most money on AI are not building tools to remove accountants. They are building tools to make them irreplaceable.",
    img:   null
  },
  'maid-eligibility-canada': {
    title: "Expanding MAID Eligibility: The Challenge of Balancing Public Autonomy and Safety — Agora",
    desc:  "Canada has until 2027 to decide whether severe mental illness qualifies for assisted dying. What the debate reveals about democracy, rights, and where we draw the line.",
    img:   null
  },
  'bc-condo-affordability': {
    title: "Federal Intent to Purchase 2,200 BC Condos Launches Larger Housing Affordability Questions — Agora",
    desc:  "As the government intervenes in the housing market with a $1.45 billion purchase plan, deeper questions about price expectations, developer incentives, and demographic shifts come into focus.",
    img:   null
  }
};

export default {
  async fetch(request, env) {
    const url  = new URL(request.url);
    const path = url.pathname;

    // Serve static files directly
    if (/\.(jpg|jpeg|png|gif|webp|svg|ico|woff2?|ttf)$/i.test(path)) {
      return env.ASSETS.fetch(request);
    }

    // Get index.html — fall back to normal serving if anything fails
    let html;
    try {
      const res = await env.ASSETS.fetch(new Request(url.origin + '/'));
      html = await res.text();
    } catch (e) {
      return env.ASSETS.fetch(request);
    }

    // Strip ALL existing og/twitter/description meta tags to avoid duplicates
    html = html.replace(/<meta\s[^>]*(?:property="og:[^"]*"|name="twitter:[^"]*"|name="description")[^>]*>/gi, '');

    // Pick values
    let title = 'Agora — A Modern Public Forum';
    let desc  = 'Finance, politics, philosophy and business — examined without deference. Countless ideas, one forum.';
    let img   = url.origin + '/agora.jpg';

    const match = path.match(/^\/article\/([\w-]+)/);
    if (match && OG[match[1]]) {
      title = OG[match[1]].title;
      desc  = OG[match[1]].desc;
      img   = OG[match[1]].img ? url.origin + OG[match[1]].img : url.origin + '/agora.jpg';
    }

    const imgTags = img
      ? `\n  <meta property="og:image" content="${img}">\n  <meta name="twitter:image" content="${img}">\n  <meta name="twitter:card" content="summary_large_image">`
      : `\n  <meta name="twitter:card" content="summary">`;

    const tags = `
  <meta name="description" content="${desc}">
  <meta property="og:site_name" content="Agora">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${url.href}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">${imgTags}
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${desc}">`;

    html = html.replace('</head>', tags + '\n</head>');

    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
  }
};
