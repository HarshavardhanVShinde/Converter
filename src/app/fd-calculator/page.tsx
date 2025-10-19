"use client";
import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/ui/glass-card";
import PageHeader from "@/components/ui/page-header";

const FDGrowthChart = dynamic(() => import("@/components/charts/fd-growth-chart"), { ssr: false });

function formatINR(n: number) {
  return n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
}

export default function FDCalculator() {
  const [principal, setPrincipal] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(7);
  const [tenure, setTenure] = useState<number>(5);
  const [compounding, setCompounding] = useState<string>("1"); // 1-yearly, 2-half, 4-quarterly, 12-monthly, 365-daily
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number>(Date.now());

  const results = useMemo(() => {
    const p = principal;
    const r = interestRate / 100;
    const t = tenure;
    const n = parseInt(compounding);
    if (p <= 0 || r <= 0 || t <= 0 || !n) return null;

    const maturityValue = p * Math.pow(1 + r / n, n * t);
    const totalInterest = maturityValue - p;

    const yearlyData: { year: number; balance: number }[] = [];
    let currentBalance = p;
    for (let i = 1; i <= t; i++) {
      const yearBalance = currentBalance * Math.pow(1 + r / n, n);
      yearlyData.push({ year: i, balance: yearBalance });
      currentBalance = yearBalance;
    }

    return {
      totalInvestment: p,
      totalInterest,
      maturityValue,
      yearlyData,
    };
  }, [principal, interestRate, tenure, compounding, lastUpdatedAt]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Title is provided by shared PageHeaderFromPath */}
      <PageHeader title="FD Calculator" description="Calculate Fixed Deposit (FD) maturity and interest with flexible compounding." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard
          title="Inputs"
          subtitle="Fixed Deposit inputs and compounding frequency."
          className="border-2 border-white/50 dark:border-white/20 bg-gradient-to-br from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 backdrop-blur-xl shadow-xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-200">Principal (₹)</label>
              <Input
                type="number"
                min={1000}
                step={500}
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="bg-white/80 dark:bg-white/10 border border-white/30 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-200">Annual interest rate (%)</label>
              <Input
                type="number"
                min={0}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="bg-white/80 dark:bg-white/10 border border-white/30 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-200">Tenure (years)</label>
              <Input
                type="number"
                min={1}
                step={1}
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="bg-white/80 dark:bg-white/10 border border-white/30 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-200">Compounding</label>
              <Select onValueChange={setCompounding} defaultValue={compounding}>
                <SelectTrigger className="bg-white/80 dark:bg-white/10 border border-white/30 dark:border-white/20 h-10">
                  <SelectValue placeholder="Select compounding" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Yearly</SelectItem>
                  <SelectItem value="2">Half-Yearly</SelectItem>
                  <SelectItem value="4">Quarterly</SelectItem>
                  <SelectItem value="12">Monthly</SelectItem>
                  <SelectItem value="365">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            className="mt-4 w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => setLastUpdatedAt(Date.now())}
          >
            Update
          </Button>
          <div className="mt-4 text-xs text-gray-600 dark:text-gray-300">
            Interest is compounded at the selected frequency using a standard compound formula.
          </div>
        </GlassCard>

        <GlassCard
          title="Results"
          subtitle="Maturity value and yearly compounding progression."
          className="border-2 border-white/50 dark:border-white/20 bg-gradient-to-br from-white/80 to-white/60 dark:from-white/10 dark:to-white/5 backdrop-blur-xl shadow-xl"
        >
          {results ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border bg-white/70 dark:bg-white/10 border-white/30 dark:border-white/20 p-4 shadow-sm">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Maturity value</div>
                  <div className="text-2xl font-semibold mt-1 text-gray-900 dark:text-white">{formatINR(results.maturityValue)}</div>
                </div>
                <div className="rounded-xl border bg-white/70 dark:bg-white/10 border-white/30 dark:border-white/20 p-4 shadow-sm">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Total interest</div>
                  <div className="text-xl font-semibold mt-1 text-gray-900 dark:text-white">{formatINR(results.totalInterest)}</div>
                </div>
                <div className="rounded-xl border bg-white/70 dark:bg-white/10 border-white/30 dark:border-white/20 p-4 shadow-sm">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Total investment</div>
                  <div className="text-xl font-semibold mt-1 text-gray-900 dark:text-white">{formatINR(results.totalInvestment)}</div>
                </div>
              </div>
              <div className="mt-6">
                <FDGrowthChart yearlyData={results.yearlyData} />
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-600 dark:text-gray-400">Enter valid inputs and click Update to see results.</div>
          )}
        </GlassCard>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard title="About FD" subtitle="Guaranteed returns with compounding" className="border-2 border-white/50 dark:border-white/20">
          Fixed Deposits are time-bound deposits with fixed interest and low risk. Returns depend on tenure and compounding frequency.
        </GlassCard>
        <GlassCard title="Considerations" subtitle="Premature withdrawal and tax" className="border-2 border-white/50 dark:border-white/20">
          Premature withdrawal may reduce returns. Interest may be taxable based on your income slab; refer to tax rules for TDS and declarations.
        </GlassCard>
        <GlassCard title="Note" subtitle="Model simplification" className="border-2 border-white/50 dark:border-white/20">
          We assume constant rate and single deposit at the start. Bank policies may vary across products.
        </GlassCard>
      </div>
    </div>
  );
}