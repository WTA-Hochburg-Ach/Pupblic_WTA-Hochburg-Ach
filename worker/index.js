import { isChronicleVisible, isShortNewsVisible, viennaDateKey } from '../public/scripts/news-visibility.js';

async function serveNotFound(request, env) {
  return env.ASSETS.fetch(new Request(new URL('/404.html', request.url), request));
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
      return env.ASSETS.fetch(request);
    }

    const url = new URL(request.url);
    const directResponse = await env.ASSETS.fetch(request);

    if (directResponse.status !== 404) {
      return url.pathname === '/news' || url.pathname === '/news.html'
        ? updateNewsResponse(directResponse, request)
        : directResponse;
    }

    if (url.pathname !== '/' && !url.pathname.endsWith('.html')) {
      const htmlResponse = await tryAsset(request, env, `${url.pathname}.html`);
      if (htmlResponse.status !== 404) {
        return url.pathname === '/news' ? updateNewsResponse(htmlResponse, request) : htmlResponse;
      }
    }

    return serveNotFound(request, env);
  },
};
