import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
// Sidebar temporarily removed in favor of new global Header navigation
// import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import CollapsibleSidebar from "@/components/collapsible-sidebar";
import MiniSidebarRail from "@/components/mini-sidebar-rail";
import LayoutShellClient from "../components/layout-shell-client";
import { NavUIProvider } from "@/components/ui/nav-context";
import { ThemeProvider } from "@/components/ui/theme-provider";
import ThemeToggle from "@/components/ui/theme-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap'
});

export const metadata: Metadata = {
  title: "TechSynth - Calculator Hub | Free Online Calculators",
  description: "Comprehensive collection of free online calculators including SIP, BMI, EMI, Currency Converter, Age Calculator, and Unit Converter. Fast, accurate, and mobile-friendly.",
  keywords: "calculator, SIP calculator, BMI calculator, EMI calculator, currency converter, age calculator, unit converter, financial calculator",
  authors: [{ name: "TechSynth" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
  <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} font-sans antialiased min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-[#0f172a] dark:via-[#0b1120] dark:to-[#020617] relative`}>        
        {/* Ambient radial accent */}
        <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(circle_at_center,white,transparent_70%)]">
          <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-indigo-200/40 dark:bg-indigo-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-emerald-200/40 dark:bg-emerald-500/10 blur-3xl" />
        </div>
        <ThemeProvider>
          <NavUIProvider>
            <LayoutShellClient>{children}</LayoutShellClient>
          </NavUIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
// Client layout wrapper imported above.
