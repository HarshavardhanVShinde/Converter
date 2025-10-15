'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<string>('')
  const [result, setResult] = useState<string>('')

  const calculateAge = () => {
    if (!birthDate) return
    
    const birth = new Date(birthDate)
    const today = new Date()
    
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    setResult(`You are ${age} years old`)
  }

  return (
    <div className="pt-8 pb-24 max-w-4xl mx-auto px-4 sm:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-soft text-white">
          <Calendar className="h-10 w-10" />
        </div>
        <h1 className="font-extrabold tracking-tight text-4xl sm:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-4">
          Age Calculator
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Calculate your exact age based on your birth date.
        </p>
      </div>

      <GlassCard className="p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Birth Date
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 bg-white/60 dark:bg-white/10 border border-white/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white transition-all"
            />
          </div>
          
          <button
            onClick={calculateAge}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-soft font-medium"
          >
            Calculate Age
          </button>
          
          {result && (
            <div className="mt-6 p-4 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl border border-white/20">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{result}</p>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  )
}