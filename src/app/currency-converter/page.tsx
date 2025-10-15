'use client'

import { useState, useEffect } from 'react'
import { DollarSign, ArrowRightLeft, TrendingUp, Globe } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { motion } from 'framer-motion'

// Mock exchange rates (in a real app, you'd fetch from an API)
const exchangeRates: { [key: string]: number } = {
  'USD': 1.00,     // Base currency
  'EUR': 0.85,
  'GBP': 0.73,
  'JPY': 110.00,
  'INR': 74.50,
  'CNY': 6.45,
  'AUD': 1.35,
  'CAD': 1.25,
  'CHF': 0.92,
  'SGD': 1.35,
  'NZD': 1.45,
  'KRW': 1180.00,
  'MXN': 20.15,
  'BRL': 5.25,
  'RUB': 73.50,
  'ZAR': 14.85,
  'SEK': 8.65,
  'NOK': 8.85,
  'DKK': 6.35,
  'PLN': 3.85,
}

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱' },
]

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>('100')
  const [fromCurrency, setFromCurrency] = useState<string>('USD')
  const [toCurrency, setToCurrency] = useState<string>('INR')
  const [convertedAmount, setConvertedAmount] = useState<number>(0)
  const [exchangeRate, setExchangeRate] = useState<number>(0)

  const convertCurrency = () => {
    const inputAmount = parseFloat(amount) || 0
    
    if (inputAmount === 0 || fromCurrency === toCurrency) {
      setConvertedAmount(inputAmount)
      setExchangeRate(1)
      return
    }

    // Convert from source currency to USD, then to target currency
    const amountInUSD = inputAmount / exchangeRates[fromCurrency]
    const finalAmount = amountInUSD * exchangeRates[toCurrency]
    const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency]
    
    setConvertedAmount(finalAmount)
    setExchangeRate(rate)
  }

  useEffect(() => {
    convertCurrency()
  }, [amount, fromCurrency, toCurrency])

  const swapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const formatAmount = (value: number, currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode)
    if (!currency) return value.toFixed(2)
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currencyCode === 'JPY' || currencyCode === 'KRW' ? 0 : 2,
      maximumFractionDigits: currencyCode === 'JPY' || currencyCode === 'KRW' ? 0 : 2,
    }).format(value)
  }

  const getPopularPairs = () => {
    const pairs = [
      { from: 'USD', to: 'INR', label: 'USD to INR' },
      { from: 'EUR', to: 'USD', label: 'EUR to USD' },
      { from: 'GBP', to: 'USD', label: 'GBP to USD' },
      { from: 'USD', to: 'JPY', label: 'USD to JPY' },
      { from: 'AUD', to: 'USD', label: 'AUD to USD' },
      { from: 'CAD', to: 'USD', label: 'CAD to USD' },
    ]
    
    return pairs.map(pair => {
      const rate = exchangeRates[pair.to] / exchangeRates[pair.from]
      return { ...pair, rate }
    })
  }

  const popularPairs = getPopularPairs()

  return (
    <div className="pt-8 pb-24 max-w-6xl mx-auto px-4 sm:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 shadow-soft text-white">
          <DollarSign className="h-10 w-10" />
        </div>
        <h1 className="font-extrabold tracking-tight text-4xl sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-4">
          Currency Converter
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Convert between different currencies with real-time exchange rates. Get instant conversions for over 20 major world currencies.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Converter Section */}
        <div className="lg:col-span-2">
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Convert Currency</h2>

            <div className="space-y-6">
              {/* Amount Input */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block tracking-wide">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 text-lg bg-white/60 dark:bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
                  placeholder="100"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Currency Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                {/* From Currency */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block tracking-wide">
                    From
                  </label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <button
                    onClick={swapCurrencies}
                    className="w-12 h-12 bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 rounded-full flex items-center justify-center transition-all border border-white/30 shadow-soft"
                    title="Swap currencies"
                  >
                    <ArrowRightLeft className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </button>
                </div>

                {/* To Currency */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 block tracking-wide">
                    To
                  </label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.flag} {currency.code} - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Result */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 dark:from-yellow-500/20 dark:to-orange-500/20 rounded-xl p-6 border border-white/30">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Converted Amount</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {formatAmount(convertedAmount, toCurrency)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
                  </p>
                </div>
              </div>

              {/* Quick Conversion */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Conversions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[1, 5, 10, 100].map((quickAmount) => {
                    const converted = (quickAmount / exchangeRates[fromCurrency]) * exchangeRates[toCurrency]
                    return (
                      <button
                        key={quickAmount}
                        onClick={() => setAmount(quickAmount.toString())}
                        className="p-3 bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 rounded-xl transition-all border border-white/30 text-center"
                      >
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {quickAmount} {fromCurrency}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ≈ {converted.toFixed(2)} {toCurrency}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Side Panel */}
        <div className="space-y-8">
          {/* Exchange Rate Info */}
          <GlassCard className="p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Exchange Rate</h3>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {exchangeRate.toFixed(4)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
              </p>
            </div>
          </GlassCard>

          {/* Popular Currency Pairs */}
          <GlassCard className="p-6">
            <div className="flex items-center mb-4">
              <Globe className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Popular Pairs</h3>
            </div>
            <div className="space-y-3">
              {popularPairs.map((pair, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setFromCurrency(pair.from)
                    setToCurrency(pair.to)
                  }}
                  className="w-full flex items-center justify-between p-3 bg-white/40 dark:bg-white/10 hover:bg-white/60 dark:hover:bg-white/20 rounded-xl transition-all border border-white/20"
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {pair.label}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {pair.rate.toFixed(4)}
                  </span>
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Currency Symbols */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Currency Info</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">From Currency</span>
                <div className="flex items-center">
                  <span className="text-lg mr-2">
                    {currencies.find(c => c.code === fromCurrency)?.flag}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {currencies.find(c => c.code === fromCurrency)?.symbol}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">To Currency</span>
                <div className="flex items-center">
                  <span className="text-lg mr-2">
                    {currencies.find(c => c.code === toCurrency)?.flag}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {currencies.find(c => c.code === toCurrency)?.symbol}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Information Section */}
      <GlassCard className="mt-16 p-8">
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">About Currency Conversion</h3>
        <div className="grid sm:grid-cols-2 gap-10 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          <div className="space-y-5">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">How Exchange Rates Work</h4>
              <p>Exchange rates determine how much one currency is worth in terms of another. They fluctuate based on economic factors, political stability, and market demand.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Factors Affecting Rates</h4>
              <ul className="space-y-1">
                <li>• Economic indicators and GDP growth</li>
                <li>• Interest rates set by central banks</li>
                <li>• Political stability and government policies</li>
                <li>• Supply and demand in forex markets</li>
              </ul>
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Important Notes</h4>
              <ul className="space-y-1">
                <li>• Rates shown are for reference purposes only</li>
                <li>• Actual bank rates may include additional fees</li>
                <li>• Exchange rates fluctuate throughout the day</li>
                <li>• Consider timing for large currency exchanges</li>
                <li>• Always check current rates before transactions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Tips for Currency Exchange</h4>
              <ul className="space-y-1">
                <li>• Compare rates from different providers</li>
                <li>• Avoid airport and hotel exchange counters</li>
                <li>• Consider using credit cards for better rates</li>
                <li>• Monitor trends for optimal exchange timing</li>
              </ul>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}