export function getBaseUrl(value = '/') {
  let baseUrl = value || '/';

  if (!baseUrl.startsWith('/')) {
    baseUrl = `/${baseUrl}`;
  }

  if (!baseUrl.endsWith('/')) {
    baseUrl = `${baseUrl}/`;
  }

  return baseUrl;
}

export function withBasePath(baseUrl: string, path = '') {
  const normalizedBaseUrl = getBaseUrl(baseUrl);
  const normalizedPath = String(path ?? '').replace(/^\/+/, '');

  return normalizedPath ? `${normalizedBaseUrl}${normalizedPath}` : normalizedBaseUrl;
}

export function withOptionalBasePath(baseUrl: string, path = '') {
  const normalizedPath = String(path ?? '').trim();

  if (!normalizedPath) {
    return '';
  }

  if (
    normalizedPath.startsWith('#') ||
    normalizedPath.startsWith('mailto:') ||
    normalizedPath.startsWith('tel:') ||
    /^[a-z]+:/i.test(normalizedPath)
  ) {
    return normalizedPath;
  }

  return withBasePath(baseUrl, normalizedPath);
}

export function normalizeSitePath(pathname: string, baseUrl = '/') {
  const normalizedBaseUrl = getBaseUrl(baseUrl);
  let normalizedPath = pathname || '/';

  if (normalizedBaseUrl !== '/' && normalizedPath.startsWith(normalizedBaseUrl)) {
    normalizedPath = normalizedPath.slice(normalizedBaseUrl.length - 1);
  }

  if (!normalizedPath.startsWith('/')) {
    normalizedPath = `/${normalizedPath}`;
  }

  if (normalizedPath.length > 1) {
    normalizedPath = normalizedPath.replace(/\/+$/, '');
  }

  return normalizedPath || '/';
}

export function isCurrentSitePath(currentPath: string, targetPath: string, baseUrl = '/') {
  return normalizeSitePath(currentPath, baseUrl) === normalizeSitePath(withBasePath(baseUrl, targetPath), baseUrl);
}
