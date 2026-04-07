'use client';

import { useState } from 'react';
import { Bell, Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

function buildBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  const segments: BreadcrumbSegment[] = [{ label: 'NexusCollab', href: '/workspaces' }];

  if (pathname.startsWith('/workspace/')) {
    const parts = pathname.split('/').filter(Boolean);
    // parts: ['workspace', wsId, 'task', taskId, 'room']
    if (parts[1]) {
      segments.push({ label: 'Workspace', href: `/workspace/${parts[1]}` });
    }
    if (parts[3]) {
      segments.push({ label: 'Task', href: `/workspace/${parts[1]}/task/${parts[3]}` });
    }
    if (parts[4] === 'room') {
      segments.push({ label: 'Chat Room' });
    }
  } else if (pathname.startsWith('/workspaces')) {
    segments.push({ label: 'Workspaces' });
  } else if (pathname === '/my-tasks') {
    segments.push({ label: 'My Tasks' });
  } else if (pathname === '/activity') {
    segments.push({ label: 'Activity' });
  } else if (pathname === '/settings') {
    segments.push({ label: 'Settings' });
  }

  return segments;
}

export function Header() {
  const pathname = usePathname();
  const breadcrumbs = buildBreadcrumbs(pathname);

  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center gap-4 border-b border-slate-800 bg-background/80 backdrop-blur-md px-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((seg, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-600" />}
            {seg.href ? (
              <a
                href={seg.href}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                {seg.label}
              </a>
            ) : (
              <span className="text-slate-200">{seg.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <button
        className={cn(
          'flex items-center gap-2 rounded-full bg-slate-800/60 px-3 py-1.5 text-sm text-slate-400',
          'hover:bg-slate-700/60 hover:text-slate-300 transition-colors',
        )}
      >
        <Search className="h-3.5 w-3.5" />
        <span className="text-xs">Search...</span>
        <kbd className="ml-2 rounded border border-slate-700 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
          ⌘K
        </kbd>
      </button>

      {/* Notification bell */}
      <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors">
        <Bell className="h-4 w-4" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-500" />
      </button>

      {/* Avatar */}
      <button className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-medium text-indigo-400">
        AV
      </button>
    </header>
  );
}
