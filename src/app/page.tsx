"use client";
import Link from "next/link";
import { Calculator, TrendingUp, Heart, DollarSign, Calendar, Ruler, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { motion } from "framer-motion";

const featuredCalculators = [
  {
    name: 'SIP Calculator',
    href: '/sip-calculator',
    icon: TrendingUp,
    description: 'Calculate returns on your SIP investments and plan your financial future with accurate projections.',
    color: 'bg-green-500'
  },
  {
    name: 'BMI Calculator',
    href: '/bmi-calculator',
    icon: Heart,
    description: 'Check your Body Mass Index and understand your health status with personalized recommendations.',
    color: 'bg-red-500'
  },
  {
    name: 'EMI Calculator',
    href: '/emi-calculator',
    icon: Calculator,
    description: 'Calculate loan EMIs for home, car, or personal loans with detailed amortization schedules.',
    color: 'bg-blue-500'
  },
  {
    name: 'Currency Converter',
    href: '/currency-converter',
    icon: DollarSign,
    description: 'Convert between different currencies with real-time exchange rates and historical data.',
    color: 'bg-yellow-500'
  },
  {
    name: 'Age Calculator',
    href: '/age-calculator',
    icon: Calendar,
    description: 'Calculate your exact age in years, months, days, and even seconds with precision.',
    color: 'bg-purple-500'
  },
  {
    name: 'Unit Converter',
    href: '/unit-converter',
    icon: Ruler,
    description: 'Convert between various units of measurement including length, weight, temperature, and more.',
    color: 'bg-indigo-500'
  }
];

export default function Home() {
  return (
    <div className="min-h-screen pt-8 pb-20">
      {/* Hero Section */}
      <section className="relative mb-16">
        <div className="absolute inset-0 -z-10">
          <div className="h-full w-full bg-gradient-to-br from-brand.indigo/15 via-transparent to-emerald-300/20 dark:from-brand.indigo/25 dark:via-transparent dark:to-emerald-500/10" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <GlassCard className="px-6 sm:px-12 py-12 md:py-20 shadow-soft-lg overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-center mx-auto max-w-4xl"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-white/10 px-4 py-2 text-xs font-medium tracking-wide uppercase text-brand.indigo shadow-inner mb-8 border border-white/60 dark:border-white/20">
                <Calculator className="h-4 w-4" /> Unified Precision Suite
              </span>
              <h1 className="font-extrabold tracking-tight text-3xl sm:text-4xl lg:text-5xl xl:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 leading-[1.1] mb-6">
                Elevate Your <span className="text-brand.indigo">Decisions</span> with Next‑Gen Calculators
              </h1>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
                Financial clarity, health insights, and everyday conversions—crafted with accuracy, performance, and a modern experience. Fully client-side, privacy‑first, and blazing fast.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <AnimatedButton asChild className="w-full sm:w-auto">
                  <Link href="/sip-calculator" className="group inline-flex items-center justify-center px-8 py-3 text-sm font-semibold">
                    Start Calculating
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </AnimatedButton>
                <AnimatedButton variant="outline" asChild className="w-full sm:w-auto">
                  <Link href="#calculators" className="inline-flex items-center justify-center px-8 py-3 text-sm font-semibold">Browse All Tools</Link>
                </AnimatedButton>
              </div>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      <section id="calculators" className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="flex flex-col items-center mb-12 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand.indigo to-brand.indigoLight dark:from-brand.indigoLight dark:to-white mb-4">
              Professional Grade Calculators
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
              Precision‑built tools engineered for clarity, performance, and trust. Explore our growing library of interactive calculators.
            </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCalculators.map((calculator, i) => {
            const Icon = calculator.icon;
            return (
              <GlassCard key={calculator.name} delay={i * 0.05} className="group h-full p-6 hover:shadow-glass-lg transition-all duration-300">
                <Link href={calculator.href} className="flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 ${calculator.color} rounded-xl shadow-soft flex items-center justify-center flex-shrink-0`}> 
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white group-hover:text-brand.indigo transition-colors mb-2">
                        {calculator.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                        {calculator.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-white/30 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-brand.indigo group-hover:text-brand.indigoLight transition-colors">
                        Try it now
                      </span>
                      <ArrowRight className="h-4 w-4 text-brand.indigo group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </GlassCard>
            );
          })}
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: '100% Accurate', desc: 'Mathematically verified formulas with precision handling to avoid floating point errors.', icon: (
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )},
              { title: 'Privacy First', desc: 'All computations run locally in your browser. We do not transmit or store your inputs.', icon: (
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              )},
              { title: 'Mobile Optimized', desc: 'Responsive, accessible, and fast—crafted for phones, tablets, and widescreen desktops.', icon: (
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              )}
            ].map((f, i) => (
              <GlassCard key={f.title} delay={0.1 + i * 0.05} className="p-6 flex flex-col gap-4 text-center sm:text-left">
                <div className="mx-auto sm:mx-0 h-12 w-12 rounded-xl bg-white/70 dark:bg-white/10 flex items-center justify-center shadow-inner flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
