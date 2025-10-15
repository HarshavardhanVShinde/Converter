// This file enables static generation for all calculator routes
export const dynamic = 'force-static'

export async function generateStaticParams() {
  return [
    { slug: 'sip-calculator' },
    { slug: 'bmi-calculator' },
    { slug: 'emi-calculator' },
    { slug: 'currency-converter' },
    { slug: 'age-calculator' },
    { slug: 'unit-converter' },
  ]
}