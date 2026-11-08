import { isChronicleVisible, isShortNewsVisible, viennaDateKey } from '../public/scripts/news-visibility.js';

const securityHeaders = {
  'content-security-policy': "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; frame-src https://www.google.com; connect-src 'self'; upgrade-insecure-requests",
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
};

function secure(response) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(securityHeaders)) headers.set(name, value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

async function serveNotFound(request, env) {
  const page = await env.ASSETS.fetch(new Request(new URL('/404.html', request.url), request));
  return new Response(request.method === 'HEAD' ? null : page.body, {
    status: 404,
    headers: page.headers,
  });
}

async function tryAsset(request, env, pathname) {
  const url = new URL(request.url);
  url.pathname = pathname;
  return env.ASSETS.fetch(new Request(url, request));
}

function updateNewsResponse(response, request) {
  if (request.method === 'HEAD' || response.status !== 200) return response;

  const today = viennaDateKey();
  let shortCount = 0;
  let chronicleCount = 0;
  const headers = new Headers(response.headers);
  headers.set('cache-control', 'no-store');
  headers.delete('content-length');

  return new HTMLRewriter()
    .on('[data-short-news]', {
      element(element) {
        const visible = isShortNewsVisible(
          element.getAttribute('data-publish-date'),
          element.getAttribute('data-expire-date'),
          today,
        );
        if (visible) {
          shortCount += 1;
          element.removeAttribute('hidden');
        } else {
          element.remove();
        }
      },
    })
    .on('[data-short-empty]', {
      element(element) { if (shortCount > 0) element.remove(); },
    })
    .on('[data-chronicle-news]', {
      element(element) {
        const visible = chronicleCount < 7 && isChronicleVisible(element.getAttribute('data-archive-after'), today);
        if (visible) {
          chronicleCount += 1;
          element.removeAttribute('hidden');
        } else {
          element.remove();
        }
      },
    })
    .on('[data-chronicle-empty]', {
      element(element) { if (chronicleCount > 0) element.remove(); },
    })
    .transform(new Response(response.body, { status: response.status, headers }));
}

export default {
  async fetch(request, env) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return secure(await env.ASSETS.fetch(request));
    }

    const url = new URL(request.url);
    const directResponse = await env.ASSETS.fetch(request);

    if (directResponse.status !== 404) {
      return secure(url.pathname === '/news' || url.pathname === '/news.html'
        ? updateNewsResponse(directResponse, request)
        : directResponse);
    }

    if (url.pathname !== '/' && !url.pathname.endsWith('.html')) {
      const htmlResponse = await tryAsset(request, env, `${url.pathname}.html`);
      if (htmlResponse.status !== 404) {
        return secure(url.pathname === '/news' ? updateNewsResponse(htmlResponse, request) : htmlResponse);
      }
    }

    return secure(await serveNotFound(request, env));
  },
};
