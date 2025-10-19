"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import PageHeader from "@/components/ui/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { xirr } from "@/utils/xirr";
import StructuredData from "@/components/seo/structured-data";
import { getWebPageJsonLd, siteUrl } from "@/lib/seo";

const XIRRWealthChart = dynamic(() => import("@/components/charts/xirr-wealth-chart"), { ssr: false });

type Frequency = "14days" | "monthly" | "quarterly" | "halfyearly" | "yearly";

function parseDateStr(s: string) { const d = new Date(s); return isNaN(d.getTime()) ? null : d; }
function fmtINR(n: number) { return n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }); }

function addDays(d: Date, days: number) { const nd = new Date(d); nd.setDate(nd.getDate() + days); return nd; }
function addMonths(d: Date, m: number) { const nd = new Date(d); nd.setMonth(nd.getMonth() + m); return nd; }

function generateSchedule(start: Date, end: Date, freq: Frequency): Date[] {
  const out: Date[] = [];
  let cur = new Date(start);
  // Generate recurring investment dates strictly before the maturity date
  while (cur.getTime() < end.getTime()) {
    out.push(new Date(cur));
    if (freq === "14days") cur = addDays(cur, 14);
    else if (freq === "monthly") cur = addMonths(cur, 1);
    else if (freq === "quarterly") cur = addMonths(cur, 3);
    else if (freq === "halfyearly") cur = addMonths(cur, 6);
    else cur = addMonths(cur, 12);
  }
  return out;
}

export default function XIRRCalculator() {
  // Defaults chosen to resemble the screenshot
  const [frequency, setFrequency] = useState<Frequency>("yearly");
  const [startDate, setStartDate] = useState<string>("2021-01-01");
  const [maturityDate, setMaturityDate] = useState<string>("2024-01-01");
  const [recurringAmount, setRecurringAmount] = useState<string>("10000");
  const [maturityAmount, setMaturityAmount] = useState<string>("60000");

  const jsonLd = useMemo(() => getWebPageJsonLd({
    name: 'XIRR Calculator – Extended Internal Rate of Return Calculator',
    description: 'Compute XIRR (annualized returns) for irregular cash flows. Model SIP-style investments and a final maturity inflow to get precise performance.',
    url: `${siteUrl}/xirr-calculator`,
    breadcrumb: ['ToolSynth', 'Calculators', 'XIRR Calculator']
  }), []);

  const scheduleDates = useMemo(() => {
    const s = parseDateStr(startDate); const e = parseDateStr(maturityDate);
    if (!s || !e || s.getTime() >= e.getTime()) return [];
    return generateSchedule(s, e, frequency);
  }, [startDate, maturityDate, frequency]);

  const flows = useMemo(() => {
    const amt = parseFloat(recurringAmount);
    const mat = parseFloat(maturityAmount);
    if (!scheduleDates.length || !isFinite(amt) || !isFinite(mat) || amt <= 0 || mat <= 0) return [];
    const invests = scheduleDates.map(d => ({ date: d.toISOString().split("T")[0], amount: -amt }));
    const end = parseDateStr(maturityDate)!;
    const maturity = { date: end.toISOString().split("T")[0], amount: mat };
    return [...invests, maturity];
  }, [scheduleDates, recurringAmount, maturityAmount, maturityDate]);

  const computed = useMemo(() => {
    const values = flows.map(f => f.amount);
    const dates = flows.map(f => parseDateStr(f.date)!).filter(Boolean);
    let rate: number | null = null;
    if (values.length >= 2 && values.length === dates.length) {
      const r = xirr(values, dates, 0.10);
      rate = isFinite(r) ? r : null;
    }
    const invested = flows.filter(f => f.amount < 0).reduce((s, f) => s + Math.abs(f.amount), 0);
    const redeemed = flows.filter(f => f.amount > 0).reduce((s, f) => s + f.amount, 0);
    const net = redeemed - invested;
    return { rate, invested, redeemed, net };
  }, [flows]);

  const investOnlyFlows = useMemo(() => flows.filter(f => f.amount < 0), [flows]);

  return (
    <div className="relative pt-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-gray-100 dark:from-gray-900" />

      <StructuredData data={jsonLd} />

      <PageHeader
        title="XIRR Calculator - Extended Internal Rate of Return Calculator"
        description="Enter investment frequency and amounts to compute annualized XIRR for your schedule. Investments are recurring outflows and maturity is the final inflow."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left panel: Inputs */}
        <GlassCard className="p-8 border-2 border-white/50 dark:border-white/20 bg-gradient-to-br from-white/90 to-white/70 dark:from-white/10 dark:to-white/5 backdrop-blur-xl shadow-xl">
          <div className="text-base font-semibold text-gray-900 dark:text-white">Investment Frequency</div>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {[
              { key: "14days", label: "14 Days" },
              { key: "monthly", label: "Monthly" },
              { key: "quarterly", label: "Quarterly" },
              { key: "halfyearly", label: "Half Yearly" },
              { key: "yearly", label: "Yearly" },
            ].map(opt => (
              <label key={opt.key} className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="freq"
                  value={opt.key}
                  checked={frequency === (opt.key as Frequency)}
                  onChange={() => setFrequency(opt.key as Frequency)}
                  className="peer h-4 w-4 accent-indigo-600"
                />
                <span className="peer-checked:text-indigo-600 text-gray-800 dark:text-gray-200">{opt.label}</span>
              </label>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-5 text-sm text-gray-700 dark:text-gray-300">Start date</div>
              <div className="col-span-7"><Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-5 text-sm text-gray-700 dark:text-gray-300">Maturity date</div>
              <div className="col-span-7"><Input type="date" value={maturityDate} onChange={(e) => setMaturityDate(e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-5 text-sm text-gray-700 dark:text-gray-300">Recurring investment amount</div>
              <div className="col-span-7"><Input type="number" placeholder="₹" value={recurringAmount} onChange={(e) => setRecurringAmount(e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-5 text-sm text-gray-700 dark:text-gray-300">Total maturity amount</div>
              <div className="col-span-7"><Input type="number" placeholder="₹" value={maturityAmount} onChange={(e) => setMaturityAmount(e.target.value)} /></div>
            </div>
          </div>
        </GlassCard>

        {/* Right panel: XIRR and Chart */}
        <GlassCard className="p-8 border-2 border-white/50 dark:border-white/20 bg-gradient-to-br from-white/90 to-white/70 dark:from-white/10 dark:to-white/5 backdrop-blur-xl shadow-xl">
          <div className="mb-5">
            <div className="text-sm text-gray-700 dark:text-gray-300">Your XIRR <span title="Annualized internal rate of return for irregular intervals" className="text-gray-400">ⓘ</span></div>
            <div className="mt-2 text-4xl font-bold text-emerald-600">{computed.rate != null ? `${(computed.rate * 100).toFixed(0)}%` : "—"}</div>
          </div>
          <div className="w-full">
            <XIRRWealthChart
              flows={investOnlyFlows}
              rate={computed.rate}
              endDate={maturityDate}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-600 dark:text-gray-300">Invested</div>
              <div className="font-semibold text-gray-900 dark:text-white">{fmtINR(computed.invested || 0)}</div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-300">Maturity</div>
              <div className="font-semibold text-gray-900 dark:text-white">{fmtINR(parseFloat(maturityAmount) || 0)}</div>
            </div>
            <div>
              <div className="text-gray-600 dark:text-gray-300">Net Profit</div>
              <div className="font-semibold text-gray-900 dark:text-white">{fmtINR(computed.net || 0)}</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Informational text (short) */}
      <GlassCard className="mt-10 p-6 border-2 border-white/50 dark:border-white/20 bg-gradient-to-br from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 backdrop-blur-xl">
        <div className="text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-4xl">
          Over the past few years, investing through SIPs has grown in popularity. XIRR helps measure returns for schedules with recurring investments and a final redemption, providing a fair annualized comparison across different timelines.
        </div>
      </GlassCard>
    </div>
  );
}