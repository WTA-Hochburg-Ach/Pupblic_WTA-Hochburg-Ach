async function serveNotFound(request, env) {
  return env.ASSETS.fetch(new Request(new URL('/404.html', request.url), request));
}

async function tryAsset(request, env, pathname) {
  const url = new URL(request.url);
  url.pathname = pathname;
  return env.ASSETS.fetch(new Request(url, request));
}

export default {
  async fetch(request, env) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return env.ASSETS.fetch(request);
    }

    const url = new URL(request.url);
    const directResponse = await env.ASSETS.fetch(request);

    if (directResponse.status !== 404) {
      return directResponse;
    }

    if (url.pathname !== '/' && !url.pathname.endsWith('.html')) {
      const htmlResponse = await tryAsset(request, env, `${url.pathname}.html`);
      if (htmlResponse.status !== 404) {
        return htmlResponse;
      }
    }

    return serveNotFound(request, env);
  },
};
