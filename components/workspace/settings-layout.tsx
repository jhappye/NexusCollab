'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Settings, Users, Bot, CreditCard } from 'lucide-react';

const tabs = [
  { href: 'general', label: 'General', icon: Settings },
  { href: 'members', label: 'Members', icon: Users },
  { href: 'agents', label: 'Agents', icon: Bot },
  { href: 'billing', label: 'Billing', icon: CreditCard },
] as const;

type Tab = typeof tabs[number]['href'];

interface SettingsLayoutProps {
  children: React.ReactNode;
  wsId: string;
  currentTab: Tab;
}

export function SettingsLayout({ children, wsId, currentTab }: SettingsLayoutProps) {
  const baseHref = `/workspace/${wsId}/settings`;

  return (
    <div className="flex gap-6 p-6">
      <nav className="hidden md:block w-48 shrink-0 space-y-0.5">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={`${baseHref}/${tab.href}`}
            className={cn(
              'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              currentTab === tab.href
                ? 'bg-indigo-500/15 text-indigo-400'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200',
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Link>
        ))}
      </nav>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
