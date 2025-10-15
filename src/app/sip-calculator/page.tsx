"use client"

import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, Calendar, Percent, ArrowRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedButton } from '@/components/ui/animated-button'

export default function SIPCalculator() {
  const [monthlyAmount, setMonthlyAmount] = useState<string>('5000')
  const [expectedReturn, setExpectedReturn] = useState<string>('12')
  const [timePeriod, setTimePeriod] = useState<string>('10')
  const [results, setResults] = useState({
    totalInvestment: 0,
    totalValue: 0,
    totalGains: 0
  })

  const calculateSIP = () => {
    const P = parseFloat(monthlyAmount) || 0
    const r = (parseFloat(expectedReturn) || 0) / 100 / 12
    const n = (parseFloat(timePeriod) || 0) * 12

    if (P === 0 || r === 0 || n === 0) {
      setResults({ totalInvestment: 0, totalValue: 0, totalGains: 0 })
      return
    }

    // SIP Future Value Formula: P * (((1 + r)^n - 1) / r) * (1 + r)
    const futureValue = P * (((Math.pow(1 + r, n) - 1) / r) * (1 + r))
    const totalInvestment = P * n
    const totalGains = futureValue - totalInvestment

    setResults({
      totalInvestment: Math.round(totalInvestment),
      totalValue: Math.round(futureValue),
      totalGains: Math.round(totalGains)
    })
  }

  useEffect(() => {
    calculateSIP()
  }, [monthlyAmount, expectedReturn, timePeriod])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="pt-8 pb-24 max-w-7xl mx-auto px-4 sm:px-8">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand.indigo to-brand.indigoLight shadow-soft text-white">
          <TrendingUp className="h-10 w-10" />
        </div>
        <h1 className="font-extrabold tracking-tight text-4xl sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-4">
          SIP Calculator
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Plan your wealth creation with interactive projections. Adjust inputs and watch your investment story update instantly.
        </p>
      </div>
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Inputs */}
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Investment Details</h2>
          <div className="space-y-8">
            <div>
              <label htmlFor="monthly" className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 tracking-wide">
                <DollarSign className="h-4 w-4 mr-2 text-brand.indigo" /> Monthly Investment (₹)
              </label>
              <input
                id="monthly"
                type="range"
                min={500}
                max={200000}
                step={500}
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(e.target.value)}
                aria-describedby="monthly-help"
                className="w-full cursor-pointer accent-brand.indigo h-2 rounded-full bg-gradient-to-r from-brand.indigo/30 to-brand.indigoLight/30"
              />
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span id="monthly-help">Min 500</span>
                <span className="font-semibold text-brand.indigo">₹ {parseInt(monthlyAmount).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div>
              <label htmlFor="return" className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 tracking-wide">
                <Percent className="h-4 w-4 mr-2 text-brand.indigo" /> Expected Annual Return (%)
              </label>
              <input
                id="return"
                type="range"
                min={1}
                max={30}
                step={0.5}
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(e.target.value)}
                className="w-full cursor-pointer accent-brand.indigo h-2 rounded-full bg-gradient-to-r from-brand.indigo/30 to-emerald-400/30"
              />
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Typical 8–15%</span>
                <span className="font-semibold text-brand.indigo">{expectedReturn}%</span>
              </div>
            </div>
            <div>
              <label htmlFor="years" className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 tracking-wide">
                <Calendar className="h-4 w-4 mr-2 text-brand.indigo" /> Investment Period (Years)
              </label>
              <input
                id="years"
                type="range"
                min={1}
                max={50}
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="w-full cursor-pointer accent-brand.indigo h-2 rounded-full bg-gradient-to-r from-brand.indigo/30 to-brand.indigoLight/30"
              />
              <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Longer horizon, higher compounding</span>
                <span className="font-semibold text-brand.indigo">{timePeriod} yrs</span>
              </div>
            </div>
          </div>
        </GlassCard>
        {/* Results */}
        <div className="space-y-8">
          <div className="grid sm:grid-cols-3 gap-4">
            {[{
              label: 'Total Investment',
              value: formatCurrency(results.totalInvestment),
              icon: <DollarSign className="h-6 w-6" />, color: 'from-brand.indigo to-brand.indigoLight'
            },{
              label: 'Total Value',
              value: formatCurrency(results.totalValue),
              icon: <TrendingUp className="h-6 w-6" />, color: 'from-emerald-500 to-emerald-400'
            },{
              label: 'Total Gains',
              value: formatCurrency(results.totalGains),
              icon: <Percent className="h-6 w-6" />, color: 'from-purple-500 to-purple-400'
            }].map((c,i)=>(
              <GlassCard key={c.label} delay={0.05 + i*0.05} className="p-5 flex flex-col gap-3">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${c.color} text-white flex items-center justify-center shadow-soft`}>{c.icon}</div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">{c.label}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{c.value}</p>
              </GlassCard>
            ))}
          </div>
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Investment Breakdown</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Principal Amount</span>
                  <span className="font-medium text-brand.indigo">{results.totalValue > 0 ? Math.round((results.totalInvestment / results.totalValue) * 100) : 0}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: results.totalValue > 0 ? `${(results.totalInvestment / results.totalValue) * 100}%` : '0%' }}
                    transition={{ duration: 0.6 }}
                    className="h-3 rounded-full bg-gradient-to-r from-brand.indigo to-brand.indigoLight"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Capital Gains</span>
                  <span className="font-medium text-emerald-600">{results.totalValue > 0 ? Math.round((results.totalGains / results.totalValue) * 100) : 0}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: results.totalValue > 0 ? `${(results.totalGains / results.totalValue) * 100}%` : '0%' }}
                    transition={{ duration: 0.6 }}
                    className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                  />
                </div>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-8">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">About SIP</h3>
            <div className="grid sm:grid-cols-2 gap-10 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">What is SIP?</h4>
                  <p>Systematic Investment Plan lets you invest a fixed amount at regular intervals, leveraging discipline and compounding.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Benefits</h4>
                  <ul className="space-y-1">
                    <li>• Cost averaging</li>
                    <li>• Power of compounding</li>
                    <li>• Discipline & flexibility</li>
                    <li>• Goal-based planning</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">How It Works</h4>
                  <p>You acquire more units when prices dip and fewer when they rise, smoothing volatility over long horizons.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Notes</h4>
                  <ul className="space-y-1">
                    <li>• Returns not guaranteed</li>
                    <li>• Longer periods amplify compounding</li>
                    <li>• Match risk to profile</li>
                    <li>• Seek independent advice</li>
                  </ul>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}