"use client";
import React from 'react';
import { useNavUI } from '@/components/ui/nav-context';
import CollapsibleSidebar from '@/components/collapsible-sidebar';
import MiniSidebarRail from '@/components/mini-sidebar-rail';
import Header from '@/components/header';

export default function LayoutShellClient({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useNavUI();
  return (
    <div className="min-h-screen flex flex-col" data-sidebar-open={sidebarOpen ? 'true' : 'false'}>
      <CollapsibleSidebar />
      <MiniSidebarRail />
      <Header />
      <main
        className={
          `flex-1 pt-20 relative z-10 transition-[margin-left] duration-300 ease-out` +
          ` md:ml-16` +
          (sidebarOpen ? ' md:ml-[300px]' : '')
        }
      >
        <div className="min-h-full pb-16">
          {children}
        </div>
      </main>
    </div>
  );
}
