'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const SIDEBAR_KEY = 'nexus-sidebar-collapsed';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_KEY);
    if (saved !== null) setCollapsed(saved === 'true');

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggle = () => {
    if (isMobile) {
      setMobileOpen(true);
    } else {
      setCollapsed((prev) => {
        const next = !prev;
        localStorage.setItem(SIDEBAR_KEY, String(next));
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {!isMobile && (
        <Sidebar collapsed={collapsed} onToggle={handleToggle} />
      )}

      {isMobile && (
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      )}

      <div
        className="transition-all duration-200"
        style={{ marginLeft: isMobile ? 0 : collapsed ? '64px' : '256px' }}
      >
        <Header onMenuToggle={isMobile ? handleToggle : undefined} />
        <main className="pt-14">
          {children}
        </main>
      </div>
    </div>
  );
}
