"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Heart,
  Calculator,
  Globe,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useNavUI } from "@/components/ui/nav-context";
import { NAV_CATEGORIES } from "@/lib/nav-data";

type NavCategory = {
  key: string;
  label: string;
  items: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
    description?: string;
  }>;
};

// Transform NAV_CATEGORIES into structure with icon components inline for header usage
const categories: NavCategory[] = NAV_CATEGORIES.map(cat => ({
  ...cat,
  items: cat.items.map(i => {
    let iconEl: React.ReactNode | undefined;
    switch (i.icon) {
      case 'DollarSign': iconEl = <DollarSign className="ml-2 h-4 w-4 text-indigo-500" />; break;
      case 'Calculator': iconEl = <Calculator className="ml-2 h-4 w-4 text-blue-500" />; break;
      case 'Percent': iconEl = <DollarSign className="ml-2 h-4 w-4 text-indigo-500" />; break; // placeholder
      case 'Heart': iconEl = <Heart className="ml-2 h-4 w-4 text-emerald-500" />; break;
      case 'Activity': iconEl = <Heart className="ml-2 h-4 w-4 text-emerald-500" />; break; // fallback for activity
      case 'Calendar': iconEl = <Calculator className="ml-2 h-4 w-4 text-blue-500" />; break; // placeholder until proper icon
      case 'Ruler': iconEl = <Calculator className="ml-2 h-4 w-4 text-blue-500" />; break;
      case 'Globe': iconEl = <Globe className="ml-2 h-4 w-4 text-gray-500" />; break;
    }
    return { ...i, icon: iconEl };
  })
}));

interface DropdownState {
  openKey: string | null;
  viaKeyboard: boolean;
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState<DropdownState>({ openKey: null, viaKeyboard: false });
  const navRef = useRef<HTMLDivElement | null>(null);
  const { toggleSidebar, sidebarOpen } = useNavUI();

  // Close on route change (mobile)
  useEffect(() => {
    setMobileOpen(false);
    setDropdown({ openKey: null, viaKeyboard: false });
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target as Node)) {
        setDropdown({ openKey: null, viaKeyboard: false });
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function openDropdown(key: string, keyboard = false) {
    setDropdown({ openKey: key, viaKeyboard: keyboard });
  }
  function closeDropdown() {
    setDropdown({ openKey: null, viaKeyboard: false });
  }

  function handleKey(e: React.KeyboardEvent<HTMLButtonElement>, key: string) {
    if (["Enter", " ", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      if (dropdown.openKey === key) {
        closeDropdown();
      } else {
        openDropdown(key, true);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (dropdown.openKey !== key) openDropdown(key, true); // open first
    } else if (e.key === "Escape") {
      closeDropdown();
    } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      // TODO: lateral nav between buttons
    }
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50" ref={navRef}>
      <div className="w-full">
        <div className="flex items-center justify-between h-16 border-b border-white/20 bg-white/80 dark:bg-white/10 backdrop-blur-md shadow-sm px-4 sm:px-8">
          {/* Left / Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? 'Close navigation panel' : 'Open navigation panel'}
              className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/30 bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {/* Breadcrumb / bars mimic */}
              <span className="flex flex-col gap-[3px] w-4">
                <span className="h-[2px] rounded bg-gradient-to-r from-indigo-500 to-indigo-400 w-full" />
                <span className="h-[2px] rounded bg-gradient-to-r from-indigo-500 to-indigo-400 w-3/4" />
                <span className="h-[2px] rounded bg-gradient-to-r from-indigo-500 to-indigo-400 w-1/2" />
              </span>
            </button>
            <Link href="/" className="flex items-center gap-2 group" aria-label="CalcHub Home">
              <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-300 dark:to-indigo-500">CalcHub</h1>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-2" aria-label="Main navigation">
            {categories.map(cat => {
              const isOpen = dropdown.openKey === cat.key;
              return (
                <div
                  key={cat.key}
                  className="relative"
                  onMouseEnter={() => openDropdown(cat.key)}
                  onMouseLeave={() => closeDropdown()}
                >
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    onKeyDown={(e) => handleKey(e, cat.key)}
                    onClick={() => (isOpen ? closeDropdown() : openDropdown(cat.key, true))}
                    className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
                  >
                    {cat.label}
                    <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        key="dropdown"
                        role="menu"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute left-0 top-full mt-2 w-64 rounded-xl border border-white/20 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-lg shadow-xl py-2 overflow-hidden"
                        onMouseEnter={() => openDropdown(cat.key)}
                      >
                        <ul className="outline-none" tabIndex={-1}>
                          {cat.items.map(item => (
                            <li key={item.href} role="none">
                              <Link
                                role="menuitem"
                                href={item.href}
                                className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 group transition-colors"
                              >
                                <span className="font-medium tracking-tight">{item.label}</span>
                                {item.icon}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
            <div className="pl-4 ml-2 border-l border-white/30">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? 'Close navigation panel' : 'Open navigation panel'}
              className="p-2 rounded-lg bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white/30 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <Menu className="h-6 w-6" />
            </button>
            <ThemeToggle />
            <button
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(o => !o)}
              className="p-2 rounded-lg bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white/30 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <Fragment>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.nav
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border-l border-white/20 shadow-xl flex flex-col"
              aria-label="Mobile navigation"
            >
              <div className="px-6 pt-6 pb-4 border-b border-white/20 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400" onClick={() => setMobileOpen(false)}>CalcHub</Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-lg bg-white/70 dark:bg-white/10 border border-white/30"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-2 py-4 space-y-8">
                {categories.map(cat => (
                  <div key={cat.key}>
                    <p className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{cat.label}</p>
                    <ul className="space-y-1">
                      {cat.items.map(item => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/60 dark:bg-white/5 border border-white/30 backdrop-blur-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition"
                            onClick={() => setMobileOpen(false)}
                          >
                            <span className="tracking-tight">{item.label}</span>
                            {item.icon}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="px-4 pt-4 border-t border-white/20 text-[11px] text-gray-500 dark:text-gray-400">© 2025 CalcHub. All rights reserved.</div>
              </div>
            </motion.nav>
          </Fragment>
        )}
      </AnimatePresence>
    </header>
  );
}
