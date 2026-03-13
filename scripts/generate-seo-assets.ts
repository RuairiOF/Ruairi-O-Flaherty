#!/usr/bin/env tsx

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { siteConfig } from '../src/content/cv'
import { getAllIndexableSeoPages, type SeoPageConfig } from '../src/content/seo-pages'
import { buildRobotsContent, createMetaDescription, toAbsoluteUrl } from '../src/lib/seo'

const DIST_DIR = join(process.cwd(), 'dist')
const DIST_INDEX_HTML_PATH = join(DIST_DIR, 'index.html')
const DEFAULT_IMAGE_PATH = '/images/branding/Main_Logo.png'
const CURRENT_DATE = new Date().toISOString().split('T')[0]

const ROUTE_ALIASES = [
  { from: '/about', to: '/experience' },
]

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeXml(value: string): string {
  return escapeHtml(value)
}

function injectIntoHead(html: string, tag: string): string {
  return html.replace('</head>', `  ${tag}\n</head>`)
}

function upsertTitle(html: string, title: string): string {
  const titleTag = `<title>${escapeHtml(title)}</title>`
  if (/<title>[\s\S]*?<\/title>/i.test(html)) {
    return html.replace(/<title>[\s\S]*?<\/title>/i, titleTag)
  }
  return injectIntoHead(html, titleTag)
}

function upsertMetaByName(html: string, name: string, content: string): string {
  const tag = `<meta name="${escapeHtml(name)}" content="${escapeHtml(content)}" />`
  const pattern = new RegExp(`<meta[^>]*name=["']${escapeRegExp(name)}["'][^>]*>`, 'i')
  if (pattern.test(html)) {
    return html.replace(pattern, tag)
  }
  return injectIntoHead(html, tag)
}

function upsertMetaByProperty(html: string, property: string, content: string): string {
  const tag = `<meta property="${escapeHtml(property)}" content="${escapeHtml(content)}" />`
  const pattern = new RegExp(`<meta[^>]*property=["']${escapeRegExp(property)}["'][^>]*>`, 'i')
  if (pattern.test(html)) {
    return html.replace(pattern, tag)
  }
  return injectIntoHead(html, tag)
}

function upsertLink(
  html: string,
  rel: string,
  href: string,
  attributes: Record<string, string> = {},
): string {
  const lookaheads = Object.entries(attributes)
    .map(([key, value]) => `(?=[^>]*${escapeRegExp(key)}=["']${escapeRegExp(value)}["'])`)
    .join('')
  const pattern = new RegExp(
    `<link${lookaheads}(?=[^>]*rel=["']${escapeRegExp(rel)}["'])[^>]*>`,
    'i',
  )
  const tagAttributes = Object.entries({ rel, ...attributes, href })
    .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
    .join(' ')
  const tag = `<link ${tagAttributes} />`

  if (pattern.test(html)) {
    return html.replace(pattern, tag)
  }
  return injectIntoHead(html, tag)
}

function removeMetaByProperty(html: string, property: string): string {
  const pattern = new RegExp(`\\s*<meta[^>]*property=["']${escapeRegExp(property)}["'][^>]*>\\s*`, 'gi')
  return html.replace(pattern, '\n')
}

function removeMetaByName(html: string, name: string): string {
  const pattern = new RegExp(`\\s*<meta[^>]*name=["']${escapeRegExp(name)}["'][^>]*>\\s*`, 'gi')
  return html.replace(pattern, '\n')
}

function injectJsonLd(html: string, schemas: Record<string, unknown>[]): string {
  const withoutExisting = html.replace(
    /\s*<script type="application\/ld\+json"[\s\S]*?<\/script>\s*/gi,
    '\n',
  )

  if (schemas.length === 0) {
    return withoutExisting
  }

  const schemaTags = schemas
    .map(
      (schema) =>
        `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`,
    )
    .join('\n')

  return withoutExisting.replace('</head>', `${schemaTags}\n</head>`)
}

function applyPageSeo(template: string, page: SeoPageConfig): string {
  const pageTitle = page.title ? `${page.title} | ${siteConfig.title}` : siteConfig.title
  const pageDescription = createMetaDescription(page.description || siteConfig.description)
  const pageKeywords = (page.keywords || siteConfig.keywords).join(', ')
  const canonicalUrl = toAbsoluteUrl(page.path, siteConfig.url)
  const imageUrl = toAbsoluteUrl(page.image || DEFAULT_IMAGE_PATH, siteConfig.url)
  const imageAlt = page.imageAlt || pageTitle
  const robotsContent = buildRobotsContent(page.noindex, page.nofollow)
  const pageType = page.type || 'website'
  const locale = page.locale || 'en_IE'

  let html = template

  html = upsertTitle(html, pageTitle)
  html = upsertMetaByName(html, 'description', pageDescription)
  html = upsertMetaByName(html, 'keywords', pageKeywords)
  html = upsertMetaByName(html, 'author', siteConfig.author)
  html = upsertMetaByName(html, 'robots', robotsContent)
  html = upsertMetaByName(html, 'googlebot', robotsContent)
  html = upsertMetaByName(html, 'referrer', 'strict-origin-when-cross-origin')

  html = upsertMetaByProperty(html, 'og:type', pageType)
  html = upsertMetaByProperty(html, 'og:title', pageTitle)
  html = upsertMetaByProperty(html, 'og:description', pageDescription)
  html = upsertMetaByProperty(html, 'og:url', canonicalUrl)
  html = upsertMetaByProperty(html, 'og:image', imageUrl)
  html = upsertMetaByProperty(html, 'og:image:secure_url', imageUrl)
  html = upsertMetaByProperty(html, 'og:image:alt', imageAlt)
  html = upsertMetaByProperty(html, 'og:site_name', siteConfig.title)
  html = upsertMetaByProperty(html, 'og:locale', locale)

  html = upsertMetaByName(html, 'twitter:card', 'summary_large_image')
  html = upsertMetaByName(html, 'twitter:title', pageTitle)
  html = upsertMetaByName(html, 'twitter:description', pageDescription)
  html = upsertMetaByName(html, 'twitter:url', canonicalUrl)
  html = upsertMetaByName(html, 'twitter:image', imageUrl)

  if (siteConfig.twitterHandle) {
    html = upsertMetaByName(html, 'twitter:site', siteConfig.twitterHandle)
    html = upsertMetaByName(html, 'twitter:creator', siteConfig.twitterHandle)
  } else {
    html = removeMetaByName(html, 'twitter:site')
    html = removeMetaByName(html, 'twitter:creator')
  }

  if (page.type === 'article' && page.publishedTime) {
    html = upsertMetaByProperty(html, 'article:published_time', page.publishedTime)
  } else {
    html = removeMetaByProperty(html, 'article:published_time')
  }

  if (page.type === 'article' && page.modifiedTime) {
    html = upsertMetaByProperty(html, 'article:modified_time', page.modifiedTime)
  } else {
    html = removeMetaByProperty(html, 'article:modified_time')
  }

  html = upsertLink(html, 'canonical', canonicalUrl)
  html = upsertLink(html, 'alternate', canonicalUrl, { hreflang: 'en-IE' })
  html = upsertLink(html, 'alternate', toAbsoluteUrl('/', siteConfig.url), { hreflang: 'x-default' })

  html = injectJsonLd(html, page.structuredData || [])

  return html
}

function getOutputPathForRoute(path: string): string {
  if (path === '/') {
    return DIST_INDEX_HTML_PATH
  }
  const relativePath = path.replace(/^\/+/, '')
  return join(DIST_DIR, relativePath, 'index.html')
}

function writeRouteHtml(routePath: string, html: string): void {
  const outputPath = getOutputPathForRoute(routePath)
  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, html, 'utf8')
}

function generateSitemap(pages: SeoPageConfig[]): string {
  const hasImages = pages.some((page) => Boolean(page.image))
  const rootAttributes = hasImages
    ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'
    : ''

  const urlEntries = pages
    .map((page) => {
      const absoluteUrl = toAbsoluteUrl(page.path, siteConfig.url)
      const imageTag = page.image
        ? `\n    <image:image>\n      <image:loc>${escapeXml(
            toAbsoluteUrl(page.image, siteConfig.url),
          )}</image:loc>\n    </image:image>`
        : ''

      return `  <url>
    <loc>${escapeXml(absoluteUrl)}</loc>
    <lastmod>${CURRENT_DATE}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(2)}</priority>${imageTag}
  </url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${rootAttributes}>
${urlEntries}
</urlset>
`
}

function generateRobots(): string {
  const hostName = new URL(siteConfig.url).host
  return `User-agent: *
Allow: /
Host: ${hostName}
Sitemap: ${toAbsoluteUrl('/sitemap.xml', siteConfig.url)}
`
}

function createRedirectPage(fromPath: string, toPath: string): string {
  const toAbsolute = toAbsoluteUrl(toPath, siteConfig.url)
  const fromAbsolute = toAbsoluteUrl(fromPath, siteConfig.url)

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Redirecting...</title>
    <meta http-equiv="refresh" content="0; url=${escapeHtml(toAbsolute)}" />
    <link rel="canonical" href="${escapeHtml(toAbsolute)}" />
    <meta name="robots" content="noindex, follow" />
    <meta property="og:url" content="${escapeHtml(fromAbsolute)}" />
  </head>
  <body>
    <p>Redirecting to <a href="${escapeHtml(toAbsolute)}">${escapeHtml(toAbsolute)}</a>.</p>
    <script>window.location.replace(${JSON.stringify(toAbsolute)});</script>
  </body>
</html>
`
}

function main(): void {
  const template = readFileSync(DIST_INDEX_HTML_PATH, 'utf8')
  const pages = getAllIndexableSeoPages()

  pages.forEach((page) => {
    const html = applyPageSeo(template, page)
    writeRouteHtml(page.path, html)
  })

  ROUTE_ALIASES.forEach((alias) => {
    writeRouteHtml(alias.from, createRedirectPage(alias.from, alias.to))
  })

  writeFileSync(join(DIST_DIR, 'sitemap.xml'), generateSitemap(pages), 'utf8')
  writeFileSync(join(DIST_DIR, 'robots.txt'), generateRobots(), 'utf8')

  console.log(`Generated SEO artifacts for ${pages.length} indexable routes.`)
}

main()
