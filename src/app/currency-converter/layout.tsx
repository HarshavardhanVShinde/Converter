import { Metadata } from 'next'
import { siteUrl } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Currency Converter - Real-time Exchange Rates | TechSynth',
  description: 'Convert between 20+ world currencies with our free online currency converter. Get real-time exchange rates for USD, EUR, GBP, JPY, INR and more.',
  keywords: 'currency converter, exchange rates, foreign exchange, USD to INR, EUR to USD, currency calculator, money converter, forex rates',
  authors: [{ name: 'TechSynth' }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Currency Converter - Live Exchange Rates',
    description: 'Free currency converter with real-time exchange rates for major world currencies. Quick and accurate currency conversions.',
    type: 'website',
    locale: 'en_US',
    url: `${siteUrl}/currency-converter`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Currency Converter - Foreign Exchange Calculator',
    description: 'Convert currencies with live exchange rates using our free online currency converter.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: `${siteUrl}/currency-converter` },
}

export { default } from './page'