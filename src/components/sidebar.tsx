"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calculator,
  Heart,
  DollarSign,
  Home,
  Calendar,
  Ruler,
  Menu,
  X,
  TrendingUp
} from 'lucide-react'
import { clsx } from 'clsx'

const calculators = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
    description: 'Welcome to TechSynth Calculator Hub'
  },
  {
    name: 'SIP Calculator',
    href: '/sip-calculator',
    icon: TrendingUp,
    description: 'Calculate SIP mutual fund returns'
  },
  {
    name: 'BMI Calculator',
    href: '/bmi-calculator',
    icon: Heart,
    description: 'Calculate Body Mass Index'
  },
  {
    name: 'Currency Converter',
    href: '/currency-converter',
    icon: DollarSign,
    description: 'Convert between currencies'
  },
  {
    name: 'EMI Calculator',
    href: '/emi-calculator',
    icon: Calculator,
    description: 'Calculate loan EMI'
  },
  {
    name: 'Age Calculator',
    href: '/age-calculator',
    icon: Calendar,
    description: 'Calculate age precisely'
  },
  {
    name: 'Unit Converter',
    href: '/unit-converter',
    icon: Ruler,
    description: 'Convert units and measurements'
  }
]

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-glass border border-white/40 hover:bg-white/90 dark:hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand.indigo"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isMobileMenuOpen ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
                transition={{ duration: 0.25 }}
              >
                <X className="h-6 w-6 text-gray-700 dark:text-gray-200" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ opacity: 0, rotate: 45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -45 }}
                transition={{ duration: 0.25 }}
              >
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.button
            aria-label="Close navigation menu"
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        aria-label="Primary"
        role="navigation"
        className={clsx('fixed top-0 left-0 h-full w-80 z-50 lg:translate-x-0')}
        initial={false}
        animate={{ x: isDesktop ? 0 : (isMobileMenuOpen ? 0 : -320) }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      >
        <div className="flex flex-col h-full rounded-r-2xl border-r border-white/40 bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-glass">
          {/* Header */}
          <div className="p-6 border-b border-white/40">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-brand.indigo to-brand.indigoLight rounded-xl flex items-center justify-center shadow-soft text-white">
                <Calculator className="h-6 w-6" />
              </div>
              <div className="leading-tight">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">TechSynth</h1>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Hub</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-transparent">
            <div className="space-y-2 pr-1">
              {calculators.map((calculator) => {
                const isActive = pathname === calculator.href
                const Icon = calculator.icon

                return (
                  <Link
                    key={calculator.name}
                    href={calculator.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={clsx(
                      'group relative flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand.indigo/60',
                      isActive
                        ? 'bg-gradient-to-r from-brand.indigo/15 to-brand.indigoLight/10 text-brand.indigo dark:text-brand.indigoLight ring-1 ring-brand.indigo/30'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                    )}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/60 dark:bg-white/10 shadow-inner">
                      <Icon
                        className={clsx(
                          'h-5 w-5 flex-shrink-0 transition-colors',
                          isActive ? 'text-brand.indigo' : 'text-gray-500 group-hover:text-brand.indigo'
                        )}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold tracking-tight">{calculator.name}</div>
                      <div className="text-[11px] leading-snug text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                        {calculator.description}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/40">
            <div className="text-[11px] text-gray-600 dark:text-gray-400 text-center leading-relaxed">
              © 2025 TechSynth.net<br />All calculators work offline
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  )
}