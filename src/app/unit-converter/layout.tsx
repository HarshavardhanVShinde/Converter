import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unit Converter - Convert Units Online | TechSynth',
  description: 'Convert between different units of measurement including length, weight, temperature, area, volume, and speed. Accurate unit conversion calculator.',
  keywords: 'unit converter, metric converter, length converter, weight converter, temperature converter, measurement converter, unit calculator',
  authors: [{ name: 'TechSynth' }],
  openGraph: {
    title: 'Unit Converter - Measurement Conversion Tool',
    description: 'Free online unit converter for length, weight, temperature, area, volume, and speed. Accurate conversions between metric and imperial units.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unit Converter - Measurement Calculator',
    description: 'Convert between different units of measurement with our comprehensive online unit converter.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export { default } from './page'