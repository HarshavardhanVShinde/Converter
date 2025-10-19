import type { Metadata } from 'next'

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://techsynth.net'
export const siteName = 'ToolSynth'

export type SEOArgs = {
  title: string
  description: string
  keywords?: string[] | string
  path: string // route path beginning with '/'
}

export function buildMetadata({ title, description, keywords, path }: SEOArgs): Metadata {
  const canonical = `${siteUrl}${path}`
  return {
    title,
    description,
    keywords,
    metadataBase: new URL(siteUrl),
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export type WebPageJSONLD = {
  name: string
  description: string
  url: string
  breadcrumb?: string[]
  applicationCategory?: string
}

export function getWebPageJsonLd({ name, description, url, breadcrumb, applicationCategory }: WebPageJSONLD) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: siteName,
      url: siteUrl,
    },
    breadcrumb: breadcrumb ? {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumb.map((label, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: label,
        item: index === 0 ? siteUrl : undefined,
      }))
    } : undefined,
    potentialAction: applicationCategory ? {
      '@type': 'SearchAction',
      target: `${siteUrl}/?q={query}`,
      'query-input': 'required name=query'
    } : undefined,
  }
}