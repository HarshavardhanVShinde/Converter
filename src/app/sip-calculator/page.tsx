"use client"

import { useState, useEffect } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { SipFrequency } from '@/components/charts/sip-growth-chart'
import dynamic from 'next/dynamic'
import PageHeader from '@/components/ui/page-header'
import ClientOnly from '@/components/ui/client-only'
import StructuredData from '@/components/seo/structured-data'
import { getWebPageJsonLd, siteUrl } from '@/lib/seo'

const SipGrowthChart = dynamic(() => import('@/components/charts/sip-growth-chart').then(mod => mod.default), { ssr: false })

// Summary rows are implemented inline below for a clean, text-only look.
export default function SIPCalculator() {
  const [lumpsumAmount, setLumpsumAmount] = useState<string>('0')
  const [monthlyAmount, setMonthlyAmount] = useState<string>('5000')
  const [expectedReturn, setExpectedReturn] = useState<string>('12')
  const [timePeriod, setTimePeriod] = useState<string>('10')
  const [mode, setMode] = useState<'sip' | 'lumpsum'>('sip')
  // Removed frequency toggle; default monthly compounding
  const [results, setResults] = useState({
    totalInvestment: 0,
    totalValue: 0,
    totalGains: 0
  })

  // Frequency fixed to monthly; removed periodsPerYear helper

  const calculateSIP = () => {
    const L = parseFloat(lumpsumAmount) || 0
    const P = parseFloat(monthlyAmount) || 0
    const m = 12
    const annual = Math.min(Math.max(parseFloat(expectedReturn) || 0, 0), 50) // clamp 0–50%
    const r = (annual) / 100 / m
    const n = Math.max(0, (parseFloat(timePeriod) || 0) * m)

    if ((L === 0 && P === 0) || r === 0 || n === 0) {
      setResults({ totalInvestment: L + P * n, totalValue: 0, totalGains: 0 })
      return
    }

    // Lumpsum Future Value: L * (1 + r)^n
    const lumpsumFutureValue = L * Math.pow(1 + r, n)

    // SIP Future Value Formula: P * (((1 + r)^n - 1) / r) * (1 + r)
    const sipFutureValue = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r))

    const futureValue = lumpsumFutureValue + sipFutureValue
    const totalInvestment = L + P * n
    const totalGains = Math.max(0, futureValue - totalInvestment)

    setResults({
      totalInvestment: Math.round(totalInvestment),
      totalValue: Math.round(futureValue),
      totalGains: Math.round(totalGains)
    })
  }

  useEffect(() => {
    calculateSIP()
  }, [lumpsumAmount, monthlyAmount, expectedReturn, timePeriod])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="relative pt-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <StructuredData data={getWebPageJsonLd({
        name: 'SIP Calculator',
        description: 'Estimate SIP returns with monthly contributions and expected annual return.',
        url: `${siteUrl}/sip-calculator`,
        breadcrumb: ['Home', 'SIP Calculator'],
        applicationCategory: 'Finance'
      })} />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-gray-100 dark:from-gray-900" />

      <PageHeader title="SIP Calculator" description="Estimate your SIP returns with monthly contributions and expected annual return." />

      {/* Layout: Chart left, Parameters right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Breakdown Chart */}
        <GlassCard className="order-1 lg:order-1 p-6 sm:p-8 border-2 border-white/50 dark:border-white/20 bg-gradient-to-br from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 backdrop-blur-xl shadow-xl">
          <div className="w-full">
            <ClientOnly>
              <SipGrowthChart
                lumpsum={parseFloat(lumpsumAmount) || 0}
                contribution={parseFloat(monthlyAmount) || 0}
                annualRatePercent={parseFloat(expectedReturn) || 0}
                years={parseFloat(timePeriod) || 0}
                frequency={'monthly' as SipFrequency}
              />
            </ClientOnly>
          </div>
        </GlassCard>

        {/* Right: Investment Parameters */}
        <GlassCard className="order-2 lg:order-2 p-8 sm:p-10 border-2 border-white/50 dark:border-white/20 bg-gradient-to-br from-white/90 to-white/70 dark:from-white/10 dark:to-white/5 backdrop-blur-xl shadow-xl">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Investment Parameters</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:gap-8">
            <div>
              <label htmlFor="lumpsum" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">Lumpsum Investment (₹)</label>
              <input id="lumpsum" type="range" min={0} max={1000000} step={10000} value={lumpsumAmount} onChange={(e) => setLumpsumAmount(e.target.value)} className="w-full cursor-pointer accent-brand.indigo h-2 rounded-full bg-gradient-to-r from-brand.indigo/30 to-brand.indigoLight/30" />
              <div className="mt-2 flex justify-between text-xs text-gray-600 dark:text-gray-400"><span>Min 0</span><span className="font-semibold text-brand.indigo">₹ {parseInt(lumpsumAmount).toLocaleString('en-IN')}</span></div>
            </div>

            <div>
              <label htmlFor="monthly" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">Monthly SIP (₹)</label>
              <input id="monthly" type="range" min={500} max={200000} step={500} value={monthlyAmount} onChange={(e) => setMonthlyAmount(e.target.value)} className="w-full cursor-pointer accent-brand.indigo h-2 rounded-full bg-gradient-to-r from-brand.indigo/30 to-brand.indigoLight/30" />
              <div className="mt-2 flex justify-between text-xs text-gray-600 dark:text-gray-400"><span>Min 500</span><span className="font-semibold text-brand.indigo">₹ {parseInt(monthlyAmount).toLocaleString('en-IN')} / month</span></div>
            </div>

            <div>
              <label htmlFor="return" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">Expected Annual Return (%)</label>
              <input id="return" type="range" min={1} max={30} step={0.5} value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} className="w-full cursor-pointer accent-brand.indigo h-2 rounded-full bg-gradient-to-r from-brand.indigo/30 to-emerald-400/30" />
              <div className="mt-2 flex justify-between text-xs text-gray-600 dark:text-gray-400"><span>Typical 8–15%</span><span className="font-semibold text-brand.indigo">{expectedReturn}%</span></div>
            </div>

            <div>
              <label htmlFor="years" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">Investment Period (Years)</label>
              <input id="years" type="range" min={1} max={50} value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} className="w-full cursor-pointer accent-brand.indigo h-2 rounded-full bg-gradient-to-r from-brand.indigo/30 to-brand.indigoLight/30" />
              <div className="mt-2 flex justify-between text-xs text-gray-600 dark:text-gray-400"><span>Longer horizon, higher compounding</span><span className="font-semibold text-brand.indigo">{timePeriod} yrs</span></div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Single card with Total Investment, Total Gains, Total Value */}
      <GlassCard className="mt-8 p-6 border-2 border-white/50 dark:border-white/20 bg-gradient-to-br from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 backdrop-blur-xl shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Investment</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(results.totalInvestment)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Gains</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(results.totalGains)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Value</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(results.totalValue)}</div>
          </div>
        </div>
      </GlassCard>

      {/* Information bars */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/50 dark:bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/30 dark:border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Investment</span>
            <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">₹ {parseInt(monthlyAmount).toLocaleString('en-IN')}</span>
          </div>
        </div>
        <div className="bg-white/50 dark:bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/30 dark:border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Expected Return</span>
            <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">{expectedReturn}% per annum</span>
          </div>
        </div>
        <div className="bg-white/50 dark:bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/30 dark:border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Investment Period</span>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">{timePeriod} years</span>
          </div>
        </div>
        <div className="bg-white/50 dark:bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/30 dark:border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Investment Type</span>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">{parseFloat(lumpsumAmount) > 0 ? 'Lumpsum + SIP' : 'SIP Only'}</span>
          </div>
        </div>
      </div>

      {/* Final information section */}
      <div className="mt-8 bg-white/30 dark:bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/20 dark:border-white/10">
        {/* Heading removed; shared PageHeaderFromPath renders the title globally */}
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <p>• Systematic Investment Plan (SIP) allows you to invest a fixed amount regularly in mutual funds</p>
          <p>• This calculator shows the potential returns based on your monthly investment, expected return rate, and investment duration</p>
          <p>• The calculations assume monthly compounding and do not account for taxes or inflation</p>
          <p>• Past performance does not guarantee future returns - mutual fund investments are subject to market risks</p>
        </div>
      </div>
    </div>
  )
}