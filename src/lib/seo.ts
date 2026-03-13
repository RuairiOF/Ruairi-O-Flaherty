const DEFAULT_META_DESCRIPTION_MAX_LENGTH = 160

function normalizePathname(pathname: string): string {
  const condensed = pathname.replace(/\/{2,}/g, '/')
  if (condensed === '/') {
    return '/'
  }
  return condensed.replace(/\/+$/g, '')
}

function sanitizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

export function normalizePath(path: string): string {
  if (!path) {
    return '/'
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    const url = new URL(path)
    url.hash = ''
    url.pathname = normalizePathname(url.pathname)
    return url.toString()
  }

  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`
  return normalizePathname(withLeadingSlash)
}

export function toAbsoluteUrl(pathOrUrl: string, siteUrl: string): string {
  const normalizedSiteUrl = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`

  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    const absolute = new URL(pathOrUrl)
    absolute.hash = ''
    absolute.pathname = normalizePathname(absolute.pathname)
    return absolute.toString()
  }

  const absolute = new URL(normalizePath(pathOrUrl), normalizedSiteUrl)
  absolute.hash = ''
  absolute.pathname = normalizePathname(absolute.pathname)
  return absolute.toString()
}

export function withBasePath(path: string, basePath: string): string {
  if (!path.startsWith('/')) {
    return path
  }

  const normalizedBase = basePath === '/' ? '/' : `${basePath.replace(/\/+$/g, '')}/`
  if (normalizedBase === '/') {
    return path
  }

  return `${normalizedBase}${path.slice(1)}`.replace(/\/{2,}/g, '/')
}

export function createMetaDescription(
  value: string,
  maxLength: number = DEFAULT_META_DESCRIPTION_MAX_LENGTH,
): string {
  const sanitized = sanitizeWhitespace(value)
  if (sanitized.length <= maxLength) {
    return sanitized
  }

  const slice = sanitized.slice(0, Math.max(0, maxLength - 3))
  const lastSpace = slice.lastIndexOf(' ')
  const truncated = lastSpace > 50 ? slice.slice(0, lastSpace) : slice
  return `${truncated}...`
}

export function dedupeKeywords(keywords: string[]): string[] {
  const seen = new Set<string>()
  const deduped: string[] = []

  for (const keyword of keywords) {
    const normalized = sanitizeWhitespace(keyword).toLowerCase()
    if (!normalized || seen.has(normalized)) {
      continue
    }

    seen.add(normalized)
    deduped.push(keyword.trim())
  }

  return deduped
}

export function buildRobotsContent(noindex?: boolean, nofollow?: boolean): string {
  const indexValue = noindex ? 'noindex' : 'index'
  const followValue = nofollow ? 'nofollow' : 'follow'
  return `${indexValue}, ${followValue}, max-image-preview:large, max-snippet:-1, max-video-preview:-1`
}

