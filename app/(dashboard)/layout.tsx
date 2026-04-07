'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

const SIDEBAR_KEY = 'nexus-sidebar-collapsed';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_KEY);
    if (saved !== null) setCollapsed(saved === 'true');
  }, []);

  const handleToggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_KEY, String(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onToggle={handleToggle} />
      <div
        className="transition-all duration-200"
        style={{ marginLeft: collapsed ? '64px' : '256px' }}
      >
        <Header />
        <main className="pt-14">
          {children}
        </main>
      </div>
    </div>
  );
}