'use client'

import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import PageHeader from '@/components/ui/page-header'
import StructuredData from '@/components/seo/structured-data'
import { getWebPageJsonLd, siteUrl } from '@/lib/seo'

const GSTBreakdownChart = dynamic(() => import('@/components/charts/gst-breakdown-chart'), { ssr: false })

export default function GSTCalculator() {
  const [amount, setAmount] = useState<string>('1000')
  const [gstRate, setGstRate] = useState<string>('18')
  const [gstType, setGstType] = useState<'exclusive' | 'inclusive'>('exclusive')
  const [results, setResults] = useState({
    originalAmount: 0,
    gstAmount: 0,
    totalAmount: 0,
  })

  const jsonLd = useMemo(() => getWebPageJsonLd({
    name: 'GST Calculator – Goods & Services Tax',
    description: 'Calculate GST for inclusive or exclusive pricing with accurate breakdowns.',
    url: `${siteUrl}/gst-calculator`,
    breadcrumb: ['ToolSynth', 'Calculators', 'GST Calculator']
  }), [])

  const calculateGST = () => {
    const numAmount = parseFloat(amount) || 0;
    const numGstRate = parseFloat(gstRate) || 0;

    if (numAmount === 0 || numGstRate === 0) {
      setResults({ originalAmount: 0, gstAmount: 0, totalAmount: 0 });
      return;
    }

    let originalAmount = 0;
    let gstAmount = 0;
    let totalAmount = 0;

    if (gstType === 'exclusive') {
      originalAmount = numAmount;
      gstAmount = (numAmount * numGstRate) / 100;
      totalAmount = originalAmount + gstAmount;
    } else { // inclusive
      totalAmount = numAmount;
      originalAmount = numAmount / (1 + numGstRate / 100);
      gstAmount = totalAmount - originalAmount;
    }

    setResults({
      originalAmount: parseFloat(originalAmount.toFixed(2)),
      gstAmount: parseFloat(gstAmount.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
    });
  };

  useEffect(() => {
    calculateGST()
  }, [amount, gstRate, gstType])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        <StructuredData data={jsonLd} />
        <PageHeader title="GST Calculator" description="Compute GST for inclusive/exclusive pricing and see tax breakdown." />

        <div className="mt-8 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-soft">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                placeholder="Enter amount"
                aria-describedby="amount-help"
              />
              <p id="amount-help" className="mt-1 text-xs text-gray-500">Base price before tax or final price if inclusive.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">GST Rate (%)</label>
              <input
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                placeholder="Enter GST rate"
                aria-describedby="rate-help"
              />
              <p id="rate-help" className="mt-1 text-xs text-gray-500">Common slabs: 5%, 12%, 18%, 28%.</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">GST Type</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setGstType('exclusive')}
                  className={`flex-1 py-3 rounded-xl transition-all ${gstType === 'exclusive' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                  Exclusive
                </button>
                <button
                  onClick={() => setGstType('inclusive')}
                  className={`flex-1 py-3 rounded-xl transition-all ${gstType === 'inclusive' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                  Inclusive
                </button>
              </div>
            </div>
          </div>

          {results.totalAmount > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">GST Breakdown</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Original Amount</p>
                  <p className="text-xl font-bold">₹{results.originalAmount.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">GST Amount</p>
                  <p className="text-xl font-bold">₹{results.gstAmount.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">Total Amount</p>
                  <p className="text-xl font-bold text-blue-800 dark:text-blue-300">₹{results.totalAmount.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="mt-6">
                <GSTBreakdownChart originalAmount={results.originalAmount} gstAmount={results.gstAmount} />
              </div>
            </div>
          )}
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Understanding GST</h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-3xl">GST is a destination-based tax applied on the supply of goods and services in India. This calculator helps you compute GST payable and final invoice totals under inclusive or exclusive pricing.</p>
        </div>
      </div>
    </div>
  )
}